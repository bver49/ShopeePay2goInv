$(document).ready(function() {
  $.ajax({
    url:'/api/orders',
    type: 'POST',
    data:{
      tt:"2017/10/11",
      tf:"2017/10/01",
      page:"0"
    },
    success: function(response) {
      console.log(response);
    }
  });
});
