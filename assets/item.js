$(document).ready(function () {

    toastr.options = {
        "closeButton": true,
        "positionClass": "toast-top-right",
        "showDuration": "0",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000"
    }

    if (localStorage) {
        $("#shopeesecret").val(localStorage.getItem("shopeesecret"));
        $("#shopeeshopid").val(localStorage.getItem("shopeeshopid"));
        $("#shopeepartnerid").val(localStorage.getItem("shopeepartnerid"));
        $("#paytwogoid").val(localStorage.getItem("paytwogoid"));
        $("#paytwogohashkey").val(localStorage.getItem("paytwogohashkey"));
        $("#paytwogohashiv").val(localStorage.getItem("paytwogohashiv"));
        $("#invurl").val(localStorage.getItem("invurl"));
        $("#invemail").val(localStorage.getItem("invemail"));
    }

    $("#save").on("click", function () {
        localStorage.setItem("shopeesecret", $("#shopeesecret").val());
        localStorage.setItem("shopeeshopid", $("#shopeeshopid").val());
        localStorage.setItem("shopeepartnerid", $("#shopeepartnerid").val());
        localStorage.setItem("paytwogoid", $("#paytwogoid").val());
        localStorage.setItem("paytwogohashkey", $("#paytwogohashkey").val());
        localStorage.setItem("paytwogohashiv", $("#paytwogohashiv").val());
        localStorage.setItem("invurl", $("#invurl").val());
        localStorage.setItem("invemail", $("#invemail").val());
    });

    var syncItem = new Vue({
        el: "#syncitem",
        data: {
            syncing: false,
            showreport:false,
            shopeeItemsAmt: 0,
            needUploadItemsAmt:0,
            needOnline:0,
            success:0,
            fail:0,
            failUploadImg:0,
            done:0,
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
                    syncItem.needUploadItemsAmt = 0;
                    syncItem.needOnline = 0;
                    syncItem.done = 0;
                    syncItem.success = 0;
                    syncItem.fail = 0;
                    syncItem.failUploadImg = 0;

                    $.ajax({
                        url: '/items/fromshopee',
                        type: 'POST',
                        data: {
                            shopeesecret: $("#shopeesecret").val(),
                            shopeeshopid: $("#shopeeshopid").val(),
                            shopeepartnerid: $("#shopeepartnerid").val()
                        },
                        success: function (response) {
                            if (response.err) {
                                toastr.warning("請檢查蝦皮金鑰是否出錯");
                                syncItem.syncing = false;
                            } else {
                                var needUploadItems = response.needUploadItems;
                                syncItem.needUploadItemsAmt = response.needUploadItems.length;
                                syncItem.showreport = true;
                                syncItem.shopeeItemsAmt = response.shopeeItemAmt;
                                if (needUploadItems.length > 0) {
                                    for (var i in needUploadItems) {
                                        upload(needUploadItems[i]);
                                    }
                                } else {
                                    syncItem.syncing = false;
                                }
                            }
                        },
                        error: function(err){
                            alert("撈取蝦皮資料錯誤請重新整理畫面");
                        }
                    });
                }
            },
            setting: function () {
                $("#settingForm").modal("show");
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
                syncItem.done++;
                if (response["@Status"] == "Success" || response["Action"] == "uploadImage") {
                    syncItem.success++;
                    syncItem.needOnline++;
                    if (response["Action"] == "uploadImage") {
                        syncItem.failUploadImg++;
                    }
                } else {
                    syncItem.fail++;
                }
                if (syncItem.done >= syncItem.needUploadItemsAmt){
                    for(var i in syncItem.report) {
                        online(syncItem.report[i]);
                    }
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

    function online(data){
        $.ajax({
            url: '/items/online/yahoo',
            type: 'post',
            dataType:'json',
            data:{
                item: JSON.stringify(data)
            },
            success: function (response) {
                syncItem.needOnline--;
                if(syncItem.needOnline==0) {
                    syncItem.syncing = false;
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    }
});
