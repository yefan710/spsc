export type ProductId =
  | '3820572380753953571'
  | '3822609501081698334'
  | '3822608064423526853'
  | '3820910710301524046'
  | '3820911041181778069'
  | '3822608850243158094';

export type ProductConfig = {
  id: ProductId;
  title: string;
  shortName: string;
  category: string;
  painLine: string;
  previewLine: string;
  resultLine: string;
  batchLine: string;
  confirmLine: string;
  resultLabels: string[];
  showSlots: number[];
  supportSlots: number[];
};

export const PRODUCT_CONFIGS: Record<ProductId, ProductConfig> = {
  '3820572380753953571': {
    id: '3820572380753953571',
    title: '欧花抹布厨房专用毛巾珊瑚绒洗碗布不沾油家用擦碗擦桌子吸水厂家',
    shortName: '厨房抹布',
    category: '厨清百货',
    painLine: '原图能看清商品，但不像能上架的主图',
    previewLine: '同一块抹布，先出一套厨清主图视觉',
    resultLine: '整套主图一起交代材质、场景和使用感',
    batchLine: '上新补图时，可以批量选中商品',
    confirmLine: '确认后自动更新到当前商品',
    resultLabels: ['场景主图', '成套展示', '材质近景', '使用感', '卖点画面'],
    showSlots: [1, 2, 3, 5],
    supportSlots: [4],
  },
  '3822609501081698334': {
    id: '3822609501081698334',
    title: '不锈钢韩式沙拉碗单层冷面料理碗金色拌饭拌面大号汤碗家用烤肉店',
    shortName: '不锈钢沙拉碗',
    category: '餐厨用品',
    painLine: '原图不是不能用，是少了餐厨主图的质感',
    previewLine: '同一只碗，先出一套餐具主图视觉',
    resultLine: '整套主图一起交代质感、容量和使用场景',
    batchLine: '多个餐厨商品，也能批量生成整套视觉',
    confirmLine: '确认后自动更新到当前商品',
    resultLabels: ['质感主图', '使用场景', '组合展示', '细节质感', '餐桌氛围'],
    showSlots: [1, 3, 4, 5, 2],
    supportSlots: [],
  },
  '3822608064423526853': {
    id: '3822608064423526853',
    title: '透明玻璃碗盘家用水果沙拉碗单个网红学生泡面创意耐热碗餐具',
    shortName: '玻璃沙拉碗',
    category: '餐厨用品',
    painLine: '原图只是商品记录，缺少可直接上架的主图冲击力',
    previewLine: '同一只玻璃碗，自动生成一整套餐厨主图',
    resultLine: '整套主图一起交代通透质感、使用场景和卖点',
    batchLine: '餐厨商品可以批量生成全套视觉',
    confirmLine: '确认后自动更新到当前商品',
    resultLabels: ['通透主图', '水果场景', '卖点主图', '细节质感', '上架视觉'],
    showSlots: [1, 2, 3, 4, 5],
    supportSlots: [],
  },
  '3820910710301524046': {
    id: '3820910710301524046',
    title: '女童夏装连衣裙新款洋气儿童polo领学院风背心裙女宝宝无袖公主裙',
    shortName: '女童学院风背心裙',
    category: '童装',
    painLine: '原图只是商品记录，缺少童装主图的穿搭感',
    previewLine: '同一件童裙，自动生成一整套上架主图',
    resultLine: '整套主图一起交代版型、穿搭和卖点',
    batchLine: '童装商品可以批量生成全套视觉',
    confirmLine: '确认后自动更新到当前商品',
    resultLabels: ['穿搭主图', '卖点主图', '细节质感', '场景展示', '上架视觉'],
    showSlots: [1, 2, 3, 4, 5],
    supportSlots: [],
  },
  '3820911041181778069': {
    id: '3820911041181778069',
    title: '2025夏季韩版女童碎花甜美吊带裙宝宝洋气甜妹可爱童裙潮A字裙',
    shortName: '女童碎花吊带裙',
    category: '童装',
    painLine: '原图能看清裙子，但不像能直接投放的主图',
    previewLine: '同一条吊带裙，自动生成甜美童装套图',
    resultLine: '整套主图一起交代风格、上身效果和氛围',
    batchLine: '多款童裙可以批量生成全套视觉',
    confirmLine: '确认后自动更新到当前商品',
    resultLabels: ['甜美主图', '上身效果', '风格场景', '细节卖点', '上架视觉'],
    showSlots: [1, 2, 3, 4, 5],
    supportSlots: [],
  },
  '3822608850243158094': {
    id: '3822608850243158094',
    title: '夏季新款宝宝母亲节短袖亮片网纱哈衣裙爱心连衣裙婴儿鞋子三件套',
    shortName: '宝宝哈衣裙套装',
    category: '童装',
    painLine: '原图信息多但画面散，缺少主图冲击力',
    previewLine: '同一套婴童商品，自动生成完整主图套图',
    resultLine: '整套主图一起交代套装、细节和氛围',
    batchLine: '婴童商品可以批量生成全套视觉',
    confirmLine: '确认后自动更新到当前商品',
    resultLabels: ['套装主图', '细节卖点', '氛围场景', '组合展示', '上架视觉'],
    showSlots: [1, 2, 3, 4, 5],
    supportSlots: [],
  },
};

export const DEFAULT_PRODUCT_ID: ProductId = '3820572380753953571';

export const getProductConfig = (productId?: string): ProductConfig => {
  if (productId && productId in PRODUCT_CONFIGS) {
    return PRODUCT_CONFIGS[productId as ProductId];
  }

  return PRODUCT_CONFIGS[DEFAULT_PRODUCT_ID];
};

export const productAsset = (productId: ProductId, file: string): string =>
  `assets/products/${productId}/images/${file}`;
