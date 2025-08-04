// 测试9999端口服务连接
const test9999Service = async () => {
  const baseUrl = 'http://localhost:9999';
  
  console.log('🔍 测试9999端口服务连接...\n');
  
  // 测试健康检查
  try {
    console.log('1. 测试健康检查...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ 健康检查成功:', healthData);
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
  }
  
  // 测试API信息
  try {
    console.log('\n2. 测试API信息...');
    const apiResponse = await fetch(`${baseUrl}/`);
    const apiData = await apiResponse.json();
    console.log('✅ API信息获取成功:', apiData);
  } catch (error) {
    console.log('❌ API信息获取失败:', error.message);
  }
  
  // 测试网络列表
  try {
    console.log('\n3. 测试获取网络列表...');
    const networksResponse = await fetch(`${baseUrl}/api/asset-pool/networks`);
    const networksData = await networksResponse.json();
    console.log('✅ 网络列表获取成功:', networksData);
  } catch (error) {
    console.log('❌ 网络列表获取失败:', error.message);
  }
  
  // 测试网络状态
  try {
    console.log('\n4. 测试网络状态...');
    const statusResponse = await fetch(`${baseUrl}/api/asset-pool/arbitrumTestnet/status`);
    const statusData = await statusResponse.json();
    console.log('✅ 网络状态获取成功:', statusData);
  } catch (error) {
    console.log('❌ 网络状态获取失败:', error.message);
  }
  
  // 测试资金池配置
  try {
    console.log('\n5. 测试资金池配置...');
    const configResponse = await fetch(`${baseUrl}/api/asset-pool/arbitrumTestnet/config`);
    const configData = await configResponse.json();
    console.log('✅ 资金池配置获取成功:', configData);
  } catch (error) {
    console.log('❌ 资金池配置获取失败:', error.message);
  }
  
  // 测试资金池余额
  try {
    console.log('\n6. 测试资金池余额...');
    const balanceResponse = await fetch(`${baseUrl}/api/asset-pool/arbitrumTestnet/balance`);
    const balanceData = await balanceResponse.json();
    console.log('✅ 资金池余额获取成功:', balanceData);
  } catch (error) {
    console.log('❌ 资金池余额获取失败:', error.message);
  }
  
  console.log('\n🎉 测试完成！');
};

// 运行测试
test9999Service().catch(console.error); 