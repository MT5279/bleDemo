/* 此文件是打印机ZPLII指令参考，含文字、条码、样表 */

// 文字
function textSend() {
	let str = '~JA'; // ~JA(打印机格式化)
	str += '^XA'; // ^XA(起始标记)
	str += '^CI26^LL70'; // ^CI(国际字体编码，一般用26) ^LL(标签长度，长度不足会打印不全)
	str += '^LH0,0^FO0,10^A0N,20,20'; // ^LH(标签起始位置x,y坐标) ^FO(字符起始位置x,y坐标) ^A(调用字体0 + N-R-I-B/旋转角度,高度,宽度)
	str += '^FD得实打印机测试-Dascom-0750-√^FS'; // ^FD(字段数据) + 数据内容 + ^FS(字段分隔符)
	str += '^XZ'; // ^XZ(结束标记)
	return str;
}

// 条码
function barcodeSend() {
	let str = '~JA'; // ~JA(打印机格式化)
	str += '^XA'; // ^XA(起始标记)
	str += '^FO0,0^BY2^LL80'; // ^FO(字符起始位置x,y坐标) ^BY(条码模块宽度1~10) ^LL(标签长度，长度不足会打印不全)
	str += '^BCN,40,Y,N,N'; // ^BC(Code 128条码 + N-R-I-B/旋转角度,高度,注释行Y-N/打印-不打印,注释行位置N-Y/下方-上方 + 校验位N-Y/不打印-打印)
	str += '^FDD1234567^FS'; // ^FD(字段数据) + 数据内容 + ^FS(字段分隔符)
	str += '^XZ'; // ^XZ(结束标记)
	return str;
}

// 二维码
function qrcodeSend() {
	let str = '~JA'; // ~JA(打印机格式化)
	str += '^XA'; // ^XA(起始标记)
	str += '^FO0,0'; // ^FO(字符起始位置x,y坐标)
	str += '^BQ,2,5^LL120'; // ^BQ(QR Code条码,模式2-1/原始-增强,放大系数/1~10) ^LL(标签长度，长度不足会打印不全)
	str += '^FDLA,http://dascom.cn^FS'; // ^FD(容错H-Q-M-L + 输入A-M/自动-手动) + 数据内容 + ^FS(字段分隔符)
	str += '^XZ'; // ^XZ(结束标记)
	return str;
}

// 样表
function tableSend() {
	let str = '~JA^XA'
	str += '^CI26^LL400' + '^LH0,0'
	str += '^FO' + '180,10' + '^A0N,' + '24,24' + '^FD' + '得实产品测试样表' + '^FS'
	str += '^FO' + '440,215' + '^BQ,2,5^FDLA,' + 'data.qrCode' + ' 3D code^FS'
	str += '^FO' + '0,50' + '^A0N,' + '20,20' + '^FD' + '得实打印机名称：' + '^FS'
	str += '^FO' + '160,50' + '^A0N,' + '20,20' + '^FD' + 'DL-203L' + '^FS'
	str += '^FO' + '340,50' + '^A0N,' + '20,20' + '^FD' + '数量(重量):' + '^FS'
	str += '^FO' + '460,50' + '^A0N,' + '20,20' + '^FD' + '01' + '台' + '^FS'
	str += '^FO' + '0,80' + '^A0N,' + '20,20' + '^FD' + '测试员' + '盖章或签名:' + '^FS'
	str += '^FO' + '190' + ',80' + '^A0N,' + '20,20' + '^FD' + '技术人员01' + '^FS'
	str += '^FO' + '0,110' + '^A0N,' + '20,20' + '^FD' + '联系方式：' + '^FS'
	str += '^FO' + '110,110' + '^A0N,' + '20,20' + '^FD' + '0750-3868008' + '^FS'
	str += '^FO' + '0,140' + '^A0N,' + '20,20' + '^FD' + '产 地:' + '^FS'
	str += '^FO' + '110,140' + '^A0N,' + '20,20' + '^FD' + '江门市得实计算机外部设备有限公司' + '^FS'
	str += '^FO' + '110,170' + '^A0N,' + '20,20' + '^FD' + '江门市江海区金星路399号得实工业园区' + '^FS'
	str += '^FO' + '0,200' + '^A0N,' + '20,20' + '^FD' + '开具日期：' + '^FS'
	str += '^FO' + '110,200' + '^A0N,' + '20,20' + '^FD' + '2020-06-11' + '^FS'
	str += '^FO' + '0,225' + '^A0N,' + '16,16' + '^FD' + '我承诺对产品质量安全以及合格证真实性负责：' + '^FS'
	str += '^FO' + '0,247' + '^A0N,' + '17,17' + '^FD' + '√' + '^FS'
	str += '^FO' + '0,250' + '^A0N,' + '16,16' + '^FD' + '□ 不使用禁限用产品材料' + '^FS'
	str += '^FO' + '0,272' + '^A0N,' + '17,17' + '^FD' + '√' + '^FS'
	str += '^FO' + '0,275' + '^A0N,' + '16,16' + '^FD' + '□ 不使用非法危险添加物' + '^FS'
	str += '^FO' + '0,297' + '^A0N,' + '17,17' + '^FD' + '√' + '^FS'
	str += '^FO' + '0,300' + '^A0N,' + '16,16' + '^FD' + '□ 遵守产品安全期规定' + '^FS'
	str += '^FO' + '0,322' + '^A0N,' + '17,17' + '^FD' + '√' + '^FS'
	str += '^FO' + '0,325' + '^A0N,' + '16,16' + '^FD' + '□ 销售的打印机产品符合国家安全标准' + '^FS'
	str += '^XZ'
	return str;
}