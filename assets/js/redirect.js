// 替换当前历史记录，保留分享链接的查询参数和章节，返回时不再回到旧首页。
window.location.replace(`/AnyDeckWeb/${window.location.search}${window.location.hash}`);
