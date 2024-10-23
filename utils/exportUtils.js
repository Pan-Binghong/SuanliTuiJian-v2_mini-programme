export function exportToCSV(query, comparisonQuery, chipData, comparisonData) {
    return new Promise((resolve, reject) => {
      let csvContent = "数据1,数据2" + (comparisonData ? ",数据3\n" : "\n");
      csvContent += "型号," + query + (comparisonData ? "," + comparisonQuery + "\n" : "\n");

      for (const [key, value] of Object.entries(chipData[query])) {
        csvContent += `${key},${value}`;
        if (comparisonData) {
          csvContent += `,${comparisonData[key]}`;
        }
        csvContent += "\n";
      }

      wx.setClipboardData({
        data: csvContent,
        success: function() {
          resolve('CSV内容已复制到剪贴板');
        },
        fail: function(error) {
          reject('复制到剪贴板失败: ' + error.errMsg);
        }
      });
    });
}