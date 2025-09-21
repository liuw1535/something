// 服务器配置
const SERVER_CONFIG = {
  PORT: 8999,
  HOST: '0.0.0.0'
};

// 认证配置
const AUTH_CONFIG = {
  // API密钥列表，可以添加多个有效的API密钥
  API_KEYS: [
    "sk-text"
  ],
  // 是否启用认证
  ENABLE_AUTH: true
};

// 模型配置
const MODELS = [
  {
    id: "Tifa-Ultra-V2-20250901",
    object: "model",
    created: 1716288000,
    owned_by: "leftnorth",
  },
  {
    id: "Tifa-Max-V2.7",
    object: "model",
    created: 1716288000,
    owned_by: "leftnorth",
  },
  {
    id: "Tifa-长记忆测试版",
    object: "model",
    created: 1716288000,
    owned_by: "leftnorth",
  }
];
const MODELS_MAPPING=[
  {"Tifa-Ultra-V2-20250901":"Tifa-Ultra-V2-20250323"},
  {"Tifa-Max-V2.7":"tifacot"},
  {"Tifa-长记忆测试版":"promax"}
]

// 默认请求参数
const DEFAULT_PARAMS = {
  model: "Tifa-Ultra-V2-20250323",
  max_tokens: 1000,
  temperature: 0.8,
  top_p: 0.8,
  repetition_penalty: 1,
  min_p: 0.05,
  frequency_penalty: 0.1,
  stream: true
};

// API配置
const API_CONFIG = {
  url: 'https://api.leftnorth.com/v1/chat/completions',
  headers: {
    'Host': 'api.leftnorth.com',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-baf65e45-1705-4451-b252-68efd29b2ccf',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    'sec-ch-ua':  '"Chromium";v="140", "Not=A?Brand";v="24", "Brave";v="140"',
    'sec-ch-ua-platform': '"Windows"',
    'sec-ch-ua-mobile':'?0',
    'Accept': '*/*',
    'Sec-GPC': '1',
    'Accept-Language': 'zh-CN,zh;q=0.5',
    'Origin': 'https://leftnorth.com',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://leftnorth.com/',
    'Accept-Encoding': 'gzip, deflate, br, zstd'
  }
};

// 禁用词列表
const BAD_WORDS = [
  {"word":"你知道","weight":3},{"word":"我知道","weight":3},{"word":"但","weight":3},
  {"word":"一抹","weight":2},{"word":"微微","weight":2},{"word":"林婉儿","weight":2},
  {"word":"王语嫣","weight":2},{"word":"柳如烟","weight":2},{"word":"总之","weight":2},
  {"word":"顾嫣然","weight":2},{"word":"沐清瑶","weight":2},{"word":"咖啡店","weight":2},
  {"word":"图书馆","weight":2},{"word":"听到","weight":2},{"word":"白T恤","weight":2},
  {"word":"牛仔短裤","weight":2},{"word":"真心话大冒险","weight":2},{"word":"一丝","weight":5},
  {"word":"一把","weight":2},{"word":"意味深长","weight":2},{"word":"狡黠","weight":2},
  {"word":"哽咽","weight":2},{"word":"富有","weight":2},{"word":"诱惑力","weight":2},
  {"word":"磁性","weight":2},{"word":"闪过","weight":5},{"word":"闪烁","weight":7},
  {"word":"指节","weight":2},{"word":"发白","weight":2},{"word":"泛起","weight":2},
  {"word":"红晕","weight":2},{"word":"利剑","weight":2},{"word":"重锤","weight":2},
  {"word":"利刃","weight":2},{"word":"窗帘","weight":2},{"word":"深吸","weight":2},
  {"word":"突然","weight":8},{"word":"不过","weight":2},{"word":"话说回来","weight":2},
  {"word":"紧紧抓住","weight":2},{"word":"不易察觉","weight":2},{"word":"危险的光芒","weight":2},
  {"word":"眼中","weight":10},{"word":"眼眸","weight":6},{"word":"闪动","weight":3},
  {"word":"光芒","weight":2},{"word":"忽然","weight":8}
];

module.exports = {
  SERVER_CONFIG,
  AUTH_CONFIG,
  MODELS,
  DEFAULT_PARAMS,
  API_CONFIG,
  BAD_WORDS,
  MODELS_MAPPING
};
