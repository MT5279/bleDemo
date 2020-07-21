document.write("<script language=javascript src='js/bledata.js'></script>"); // 打印机ZPLII指令

// 蓝牙服务uuid 与 蓝牙特征值uuid（DP-230L便携式热敏打印机）
const serviceId = '49535343-FE7D-4AE5-8FA9-9FAFD205E455';
const characteristicId = '49535343-8841-43F4-A8D4-ECBE34729BB3';

/* 以下代码仅是Demo连接低功耗蓝牙与发送指令选择的一种方法，仅供参考 */

// 开启蓝牙功能模块
function openBluetoothAdapter() {
	let self = this;
	plus.bluetooth.openBluetoothAdapter({
		success: function(e) {
			console.log('open success: ' + JSON.stringify(e));
			self.startBluetoothDevicesDiscovery();
		},
		fail: function(e) {
			console.log('open failed: ' + JSON.stringify(e));
			mui.alert('蓝牙功能未开启');
		}
	});
}

// 开启蓝牙搜索模块
function startBluetoothDevicesDiscovery() {
	let self = this;
	closeConnection('none'); // 非必要，仅防误操作
	plus.bluetooth.startBluetoothDevicesDiscovery({
		allowDuplicatesKey: false,
		success: function(e) {
			console.log('start discovery success: ' + JSON.stringify(e));
			self.onBluetoothDeviceFound();
		},
		fail: function(e) {
			console.log('start discovery failed: ' + JSON.stringify(e));
			mui.alert('蓝牙搜索失败');
		}
	});
}

// 搜索附近蓝牙设备
function onBluetoothDeviceFound() {
	let list = document.getElementById('list');
	list.innerHTML = '';
	let arr = [];
	plus.bluetooth.onBluetoothDeviceFound(function(e) {
		let devices = e.devices;
		for (let i in devices) {
			// 此处是筛选名字含“230L”的蓝牙设备（请按实际修改）
			if (devices[i].name.indexOf('230L') > 0 && arr.indexOf(devices[i].name) === -1) {
				console.log('devices' + i + ': ' + JSON.stringify(devices[i]));
				arr.push(devices[i].name);
				let div = document.createElement('div');
				div.setAttribute('onclick', 'createBLEConnection("' + devices[i].deviceId + '")');
				div.innerHTML = '<div class="block"><b>' + e.devices[i].name + '</b><br />设备ID: ' + e.devices[i].deviceId +
					'<br />信号强度: ' + e.devices[i].RSSI + 'dBm</div>';
				list.appendChild(div);
			}
		}
	});
}

// 关闭蓝牙搜索模块
function stopBluetoothDevicesDiscovery(type = 'both') {
	plus.bluetooth.stopBluetoothDevicesDiscovery({
		success: function(e) {
			console.log('stop discovery success: ' + JSON.stringify(e));
			document.getElementById('list').innerHTML = '';
			// 关闭蓝牙功能模块
			if (type == 'both') {
				plus.bluetooth.closeBluetoothAdapter({
					success: function(e) {
						console.log('close success: ' + JSON.stringify(e));
						mui.alert('蓝牙搜索关闭成功');
					},
					fail: function(e) {
						console.log('close failed: ' + JSON.stringify(e));
					}
				});
			}
		},
		fail: function(e) {
			console.log('stop discovery failed: ' + JSON.stringify(e));
		}
	});
}

// 连接目标蓝牙设备
function createBLEConnection(id) {
	if (id) {
		mui.toast('蓝牙连接中...');
		plus.bluetooth.createBLEConnection({
			deviceId: id,
			success: function(e) {
				console.log('create connection success: ' + JSON.stringify(e));
				if (e.code === 0) {
					mui('.mui-popover').popover('show', document.getElementById("list"));
					mui.toast('蓝牙连接成功');
					localStorage.setItem('deviceId', id);
					stopBluetoothDevicesDiscovery('first'); // 关闭搜索，非必要
				}
			},
			fail: function(e) {
				console.log('create connection failed: ' + JSON.stringify(e));
				mui.alert('蓝牙连接失败');
				localStorage.clear();
			}
		});
	}
}

// 按钮点击事件
function writeBleTap(type) {
	let str = '';
	switch (type) {
		case '文字':
			str = this.textSend();
			break;
		case '条码':
			str = this.barcodeSend();
			break;
		case '二维码':
			str = this.qrcodeSend();
			break;
		case '样表':
			str = this.tableSend();
			mui.toast('数据发送中...');
			break;
	}
	if (str != '') {
		// 指令字符串先转码才可发送
		writeBleChaValue(str2ab(str));
	}
}

// 断开蓝牙设备连接
function closeConnection(msg) {
	let id = localStorage.getItem('deviceId');
	if (id) {
		plus.bluetooth.closeBLEConnection({
			deviceId: id,
			success: function(e) {
				console.log('close success: ' + JSON.stringify(e));
				if (msg != 'none') {
					mui.toast('蓝牙设备已断开');
				}
				localStorage.clear();
			},
			fail: function(e) {
				console.log('close failed: ' + JSON.stringify(e));
				if (msg != 'none') {
					mui.alert('断开蓝牙设备连接失败');
				}
			}
		});
	}
	mui('.mui-popover').popover('hide', document.getElementById("list"));
}

// 发送蓝牙设备数据
function writeBleChaValue(buffer, slice = 0) {
	let self = this
	let id = localStorage.getItem('deviceId');
	if (id && buffer) {
		// 根据设备要求限制单次传输数据大小，建议每次写入不超过20字节
		plus.bluetooth.writeBLECharacteristicValue({
			deviceId: id,
			serviceId: serviceId,
			characteristicId: characteristicId,
			value: buffer.slice(slice, slice + 20),
			success: function(e) {
				console.log(slice + ' write characteristics success: ' + JSON.stringify(e));
				// 并行调用发送可能导致失败，改为一次发送成功才执行下一次
				if (buffer.byteLength > (slice + 20)) {
					writeBleChaValue(buffer, slice + 20);
				}
			},
			fail: function(e) {
				console.log(slice + ' write characteristics failed: ' + JSON.stringify(e));
				mui.alert(e.message);
			}
		});
		/*// 根据设备要求限制单次传输数据大小，建议每次写入不超过20字节
		for (var i = 0; i < buffer.byteLength; i += 20) {
			plus.bluetooth.writeBLECharacteristicValue({
				deviceId: id,
				serviceId: serviceId,
				characteristicId: characteristicId,
				value: buffer.slice(i, i + 20),
				success: function(e) {
					console.log(i + ' write characteristics success: ' + JSON.stringify(e));
				},
				fail: function(e) {
					console.log(i + ' write characteristics failed: ' + JSON.stringify(e));
				}
			});
			// 暂停一下，简单粗暴
			pauseTime(5);
		}*/
	}
}

// 字符串转ArrayBuffer
function str2ab(str) {
	let bytes = plus.android.invoke(str, 'getBytes', 'gbk');
	//let bytes = toGbkBytes(str);
	return new Uint8Array(bytes);
}

/*// 字符串转GbkBytes（需要加载外部js）
function toGbkBytes(str) {
	var str = $URL.encode(str)
	var byteArr = new Array();
	for (var i = 0; i < str.length; i++) {
		var ch = str.charAt(i);
		if (ch == '%') {
			var num = str.charAt(i + 1) + str.charAt(i + 2);
			num = parseInt(num, 16);
			num = num | (-1 << 8);
			byteArr.push(num);
			i += 2;
		} else {
			byteArr.push(ch.charCodeAt());
		}
	}
	return byteArr;
}*/

/*// 暂停一下，目的只是防止并行调用发送可能导致失败，可自行优化
function pauseTime(millTime) {
	var start = Date.now();
	while (true) {
		var nowTime = Date.now();
		var offset = nowTime - start;
		if (offset >= millTime) {
			break;
		}
	}
}*/
