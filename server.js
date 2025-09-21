const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const { SERVER_CONFIG, AUTH_CONFIG, MODELS, DEFAULT_PARAMS, API_CONFIG, BAD_WORDS, MODELS_MAPPING } = require('./config');

const app = express();
const PORT = SERVER_CONFIG.PORT;

// 中间件
app.use(cors());
// 增加请求体大小限制，设置为 50MB
app.use(bodyParser.json({ limit: '50mb' }));

// 认证中间件
const authenticateApiKey = (req, res, next) => {
  // 如果认证被禁用，直接通过
  if (!AUTH_CONFIG.ENABLE_AUTH) {
    return next();
  }

  // 获取请求头中的 Authorization
  const authHeader = req.headers.authorization;
  
  // 检查 Authorization 头是否存在
  if (!authHeader) {
    return res.status(401).json({ 
      error: {
        message: "Authentication required. Please provide a valid API key.",
        type: "authentication_error",
        code: "api_key_required"
      }
    });
  }
  
  // 检查 Authorization 格式是否正确
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      error: {
        message: "Invalid authentication format. Use 'Bearer YOUR_API_KEY'.",
        type: "authentication_error",
        code: "invalid_auth_format"
      }
    });
  }
  
  const apiKey = parts[1];
  
  // 验证 API 密钥是否有效
  if (!AUTH_CONFIG.API_KEYS.includes(apiKey)) {
    return res.status(401).json({ 
      error: {
        message: "Invalid API key provided.",
        type: "authentication_error",
        code: "invalid_api_key"
      }
    });
  }
  
  // 认证通过，继续处理请求
  next();
};

// 请求日志中间件
app.use((req, res, next) => {
  const start = Date.now();
  const method = req.method.toLowerCase();
  const path = req.originalUrl || req.url;
  
  // 保存原始的 end 方法
  const originalEnd = res.end;
  
  // 重写 end 方法
  res.end = function(...args) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    console.log(`[${method}] - ${path} ${statusCode} ${duration}ms`);
    
    // 调用原始的 end 方法
    return originalEnd.apply(this, args);
  };
  
  next();
});

// 模型列表接口
app.get('/v1/models', authenticateApiKey, (req, res) => {
  res.json({
    object: "list",
    data: MODELS
  });
});

// 对话接口
app.post('/v1/chat/completions', authenticateApiKey, async (req, res) => {
  try {
    // 设置响应头，支持SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 从请求中获取必要参数
    const { messages, model, temperature, max_tokens, top_p, repetition_penalty, min_p, frequency_penalty, stream } = req.body;

    messages.forEach(message => {
      if (message.role === 'user'){
        const text = message.content;
        message.content = [{
          "type":"text",
          "text":text
        }]
      }
    });
    
    // 使用 MODELS_MAPPING 映射模型名称
    let mappedModel = model;
    if (model) {
      // 在 MODELS_MAPPING 中查找匹配项
      const mapping = MODELS_MAPPING.find(item => Object.keys(item)[0] === model);
      if (mapping) {
        // 如果找到匹配项，使用映射后的值
        mappedModel = mapping[model];
      }
    }
    
    // 构建请求体
    const requestBody = {
      model: mappedModel || DEFAULT_PARAMS.model,
      messages: messages,
      max_tokens: max_tokens || DEFAULT_PARAMS.max_tokens,
      temperature: temperature || DEFAULT_PARAMS.temperature,
      top_p: top_p || DEFAULT_PARAMS.top_p,
      repetition_penalty: repetition_penalty || DEFAULT_PARAMS.repetition_penalty,
      min_p: min_p || DEFAULT_PARAMS.min_p,
      frequency_penalty: frequency_penalty || DEFAULT_PARAMS.frequency_penalty,
      stream: stream !== undefined ? stream : DEFAULT_PARAMS.stream,
      extra_body: {
        "bad_words": BAD_WORDS
      }
    };

    // 使用配置中的请求头
    const headers = API_CONFIG.headers;

    // 发送请求到目标API
    const response = await axios({
      method: 'post',
      url: API_CONFIG.url,
      data: requestBody,
      headers: headers,
      responseType: 'stream',
      timeout: 60000 // 设置超时时间为 60 秒
    });

    // 将流式响应转发给客户端
    response.data.on('data', (chunk) => {
      res.write(chunk);
    });

    response.data.on('end', () => {
      res.end();
    });

    // 处理客户端断开连接
    req.on('close', () => {
      response.data.destroy();
    });
  } catch (error) {
    console.error('Error:', error.message);
    
    // 如果流已经开始，发送错误事件
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    } else {
      res.write(`data: {"error": "${error.message}"}\n\n`);
      res.end();
    }
  }
});

// 启动服务器
app.listen(PORT, SERVER_CONFIG.HOST, () => {
  console.log(`Server is running on http://${SERVER_CONFIG.HOST}:${PORT}`);
});
