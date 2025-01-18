export type LiveCat1 = {
  id?: number;
  name?: string;
  zh_name?: string;
  list_name?: string;
  probation?: string;
  one_month_price?: string;
  three_month_price?: string;
  six_month_price?: string;
  nine_month_price?: string;
  twelve_month_price?: string;
  description?: string;
  sort?: number;
  created?: number;
  updated?: number;
  deleted?: boolean;
  is_show?: boolean;
  is_charge?: boolean;
  price?: string;
  identity?: string;
  combo_id?: number;
  version?: string;
  combo_name?: string;
  domain?: string; // 播放域名
  config_version?: number; // 配置版本号
  type?: string;
  app_max_buffer?: number;
  content_latency?: number;
  stream_max_buffer?: number;
  mpegts_cache?: string;
  interval?: number;
  max_retry?: number;
  timeout?: number;
  pull_on_start?: string;
};
