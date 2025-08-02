export default function Dashboard() {
  return (
    <div className='container mx-auto px-6 py-8'>
      <h1 className='text-3xl font-bold mb-8'>仪表板</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>{/* 这里可以添加其他仪表板组件 */}</div>
    </div>
  );
}
