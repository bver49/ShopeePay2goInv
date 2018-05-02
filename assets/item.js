$(document).ready(function () {

    var needUploadItemsAmt = 0;

    toastr.options = {
        "closeButton": true,
        "positionClass": "toast-top-right",
        "showDuration": "0",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000"
    }

    var syncItem = new Vue({
        el: "#syncitem",
        data: {
            syncing: false,
            showreport:false,
            success:0,
            fail:0,
            failUploadImg:0,
            shopeeItemsAmt:0,
            needUploadItemsAmt:0,
            items:[],
            report:[]
        },
        filters: {
            time: function (value) {
                var time = new Date(new Date(value).getTime() + (8 * 60 * 60 * 1000));
                return time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate() + " " + ((time.getHours() < 10) ? ("0" + time.getHours()) : (time.getHours())) + ":" + ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : (time.getMinutes()));
            },
            status:function(status, action){
                if(status == "Success") {
                    return "同步成功";
                } else {
                    if (action == "uploadImage") {
                        return "圖片上傳失敗";
                    } else {
                        return "同步失敗";
                    }
                }
            }
        },
        mounted:function(){
            $.ajax({
                url: '/items/logs',
                type: 'get',
                success: function (response) {
                    syncItem.items = response;
                }
            });
        },
        methods:{
            sync:function(){
                if (confirm("確定要同步商品?")) {
                    syncItem.syncing = true;
                    syncItem.showreport = false;
                    syncItem.report = [];
                    syncItem.shopeeItemsAmt = 0;
                    syncItem.success = 0;
                    syncItem.fail = 0;
                    syncItem.failUploadImg = 0;
                    syncItem.needUploadItemsAmt = 0;
                    $.ajax({
                        url: '/items/fromshopee',
                        type: 'POST',
                        success: function (response) {
                            var needUploadItems = response.needUploadItems;
                            needUploadItemsAmt = needUploadItems.length;
                            syncItem.showreport = true;
                            syncItem.needUploadItemsAmt = needUploadItems.length;
                            syncItem.shopeeItemsAmt = response.shopeeItemAmt;
                            for (var i in needUploadItems){
                                upload(needUploadItems[i]);
                            }
                        },
                        error: function(err){
                            alert("撈取蝦皮資料錯誤請重新整理畫面");
                        }
                    });
                }
            }
        }
    });

    function upload(orderData){
        $.ajax({
            url: '/items/upload/yahoo',
            type: 'post',
            dataType:'json',
            data:{
                orderData: JSON.stringify(orderData),
                priceRate: parseFloat($('#priceRate').val())
            },
            success: function (response) {
                syncItem.report.push(response);
                console.log(syncItem.report);
                needUploadItemsAmt--;
                if(needUploadItemsAmt <= 0){
                    syncItem.syncing = false;
                    $.ajax({
                        url: '/items/logs',
                        type: 'get',
                        success: function (response) {
                            syncItem.items = response;
                        }
                    });
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    }
});
