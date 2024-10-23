// 根据用户输入的需求，推荐合适的GPU.
// 总共分为两类推荐, 一类是训练GPU, 另一类是推理GPU.
// 训练GPU: 需要较大的显存, 需要较大的显存带宽, 需要较大的显存带宽.
export default function openSelection() {
    uni.navigateTo({
      url: '/pages/selection/selection',
      success: function() {
        console.log('Successfully navigated to selection page');
      },
      fail: function(error) {
        console.error('Failed to navigate to selection page:', error);
        // 显示更详细的错误信息
        uni.showModal({
          title: '页面跳转失败',
          content: '错误详情: ' + JSON.stringify(error),
          showCancel: false
        });
      },
      complete: function() {
        console.log('Navigation attempt completed');
      }
    });
  }