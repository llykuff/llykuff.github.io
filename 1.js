// 模拟农产品数据（可通过后台录入接口存储）
function saveMockData() {
    const productData = {
        "P20250522001": {
            productName: "山东烟台红富士苹果",
            batchNo: "20250501",
            producer: "烟台果蔬合作社",
            plant: {
                info: "种植周期：2024.10-2025.05<br>种植基地：烟台栖霞",
                pesticides: [
                    { date: "2025.03.15", name: "低毒杀菌剂", dosage: "50ml/亩" },
                    { date: "2025.04.01", name: "生物防虫剂", dosage: "30ml/亩" }
                ]
            },
            process: {
                info: "加工日期：2025.05.10<br>加工工厂：XX食品加工厂",
                report: "检测结果：合格<br>检测日期：2025.05.12"
            },
            transport: {
                info: "运输周期：2025.05.15-2025.05.18<br>物流公司：顺丰速运",
                route: [
                    { city: "烟台", time: "2025.05.15 08:00" },
                    { city: "青岛", time: "2025.05.15 14:00" },
                    { city: "上海", time: "2025.05.18 09:00" }
                ]
            },
            sell: {
                info: "上架日期：2025.05.19<br>销售平台：XX生鲜超市",
                channel: "线下门店+线上商城"
            }
        }
    };
    localStorage.setItem("farmProducts", JSON.stringify(productData));
}

// 初始化模拟数据（首次加载时调用）
if (!localStorage.getItem("farmProducts")) {
    saveMockData();
}
// 生成二维码（用于产品录入页面）
function generateQRCode(productId) {
    const qrcode = new QRCode("qrcode", {
        text: productId,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// 解析二维码（模拟扫码功能，实际需调用摄像头API）
function mockScanQRCode() {
    // 此处可接入摄像头扫码库（如jsQR），示例直接读取输入框内容
    const productId = document.getElementById("productId").value;
    if (productId) {
        searchProduct(productId);
    }
}
function searchProduct(productId = null) {
    const productData = JSON.parse(localStorage.getItem("farmProducts"));
    const targetProduct = productData[productId || "P20250522001"]; // 默认查询第一个产品

    if (!targetProduct) {
        alert("未找到该产品信息！");
        return;
    }

    // 渲染基本信息
    document.getElementById("productName").innerHTML = targetProduct.productName;
    document.getElementById("batchNo").textContent = targetProduct.batchNo;
    document.getElementById("producer").textContent = targetProduct.producer;

    // 渲染种植阶段
    const plantInfo = targetProduct.plant;
    document.getElementById("plantInfo").innerHTML = plantInfo.info;
    const pesticideList = document.getElementById("pesticideList");
    pesticideList.innerHTML = plantInfo.pesticides.map(p => `<li>${p.date}：${p.name}（${p.dosage}）</li>`).join("");

    // 渲染加工阶段
    document.getElementById("processInfo").innerHTML = targetProduct.process.info;
    document.getElementById("testReport").textContent = targetProduct.process.report;

    // 渲染运输阶段（模拟地图路径）
    const transportInfo = targetProduct.transport;
    document.getElementById("transportInfo").innerHTML = transportInfo.info;
    renderMap(transportInfo.route);

    // 渲染销售阶段
    document.getElementById("sellInfo").innerHTML = targetProduct.sell.info;
    document.getElementById("salesChannel").textContent = targetProduct.sell.channel;

    // 显示追溯信息
    document.getElementById("traceInfo").style.display = "block";
    generateQRCode(productId || "P20250522001"); // 显示当前产品追溯码
}

// 模拟地图渲染（可替换为真实API，如Leaflet）
function renderMap(route) {
    const mapContainer = document.getElementById("map");
    mapContainer.innerHTML = `
        <p>运输路线：${route.map(p => p.city).join(" → ")} </p>
        <img src="mock-map.png" alt="模拟物流路径" style="width: 100%; height: 200px;">
    `;
}

// 展开/收起详情
function toggleDetails(btn) {
    const detail = btn.nextElementSibling;
    detail.style.display = detail.style.display === "none" ? "block" : "none";
    btn.textContent = detail.style.display === "none" ? "查看详情" : "收起详情";
}

// 初始化查询
searchProduct();