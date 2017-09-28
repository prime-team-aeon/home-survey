myApp.controller('AdminController', function(CsvService) {
  console.log('AdminController created');
  var self = this;

  self.uploadCsv = function(){
    console.log('ac.uploadCsv()');       
  }

  function handleFileSelect(fileEvent){
    console.log('hfs');
    
    reader = new FileReader();
    reader.onerror = function(){
      console.log('reader error');
    };
    reader.onload = function(readerEvent){
      console.log('reader onload', readerEvent);
      // this is where we actually send the data onward

      CsvService.uploadCsv(readerEvent.target.result);
    }
    reader.readAsText(fileEvent.target.files[0]);
  }

  document.getElementById('admin-file-input').addEventListener('change', handleFileSelect, false);
});
