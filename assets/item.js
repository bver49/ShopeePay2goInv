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
        $("#yahooapikey").val(localStorage.getItem("yahooapikey"));
        $("#yahooapisecret").val(localStorage.getItem("yahooapisecret"));
    }

    $("#save").on("click", function () {
        localStorage.setItem("shopeesecret", $("#shopeesecret").val());
        localStorage.setItem("shopeeshopid", $("#shopeeshopid").val());
        localStorage.setItem("shopeepartnerid", $("#shopeepartnerid").val());
        localStorage.setItem("yahooapikey", $("#yahooapikey").val());
        localStorage.setItem("yahooapisecret", $("#yahooapisecret").val());
    });

    var syncItem = new Vue({
        el: "#syncitem",
        data: {
            selectPayTypeAndShipType:false,
            syncing: false,    //同步中
            cleaning: false,   //清除中
            showreport:false,   //是否顯示上傳報告
            shopeeItemsAmt: 0,  //總共多少商品
            needUploadItemsAmt:0,   //總共多少商品待上傳
            needOnline:0,          //總共多少商品待上架
            payType:[],
            shipType:[],
            choosePayType:[],
            chooseShipType:[],
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
            getPayTypeAndShipType:function(){
                syncItem.payType = [];
                syncItem.shipType = [];
                syncItem.choosePayType = [];
                syncItem.chooseShipType = [];

                $.ajax({
                    url: '/items/yahoo/getPayTypeAndShipType',
                    type: 'POST',
                    data: {
                        yahooapikey: $("#yahooapikey").val(),
                        yahooapisecret: $("#yahooapisecret").val()
                    },
                    success: function (response) {
                        if (response.err) {
                            toastr.warning("請檢查Yahoo金鑰是否出錯");
                        } else {
                            syncItem.selectPayTypeAndShipType = true;
                            syncItem.payType = response.payType;
                            syncItem.shipType = response.shipType;
                            console.log(response);
                        }
                    }
                });
            },
            sync:function(){
                if (confirm("確定要同步商品?")) {
                    if (syncItem.choosePayType.length == 0 || syncItem.chooseShipType.length == 0) {
                        toastr.warning("請至少各選擇一個");
                        return;
                    }
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
                            shipType: syncItem.chooseShipType,
                            payType: syncItem.choosePayType,
                            shopeesecret: $("#shopeesecret").val(),
                            shopeeshopid: $("#shopeeshopid").val(),
                            shopeepartnerid: $("#shopeepartnerid").val(),
                            yahooapikey: $("#yahooapikey").val(),
                            yahooapisecret: $("#yahooapisecret").val()
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
            clean:function(){
                if (confirm("確定要刪除商品?")) {
                    syncItem.cleaning = true;
                    $.ajax({
                        url: '/items/offline/yahoo',
                        type: 'POST',
                        data: {
                            yahooapikey: $("#yahooapikey").val(),
                            yahooapisecret: $("#yahooapisecret").val()
                        },
                        success: function (response) {
                            syncItem.cleaning = false;
                            if (response.err) {
                                toastr.warning("請檢查Yahoo金鑰是否出錯");
                            } else {
                                if(response.amount > 0 ) {
                                    toastr.success("刪除商品成功，總共刪除" + response.amount + "項商品!");
                                } else {
                                    toastr.success("沒有商品可被清除!");
                                }
                            }
                        },
                        error: function (err) {
                            syncItem.cleaning = false;
                            alert("刪除商品發生錯誤請重新整理");
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
                shipType: syncItem.chooseShipType,
                payType: syncItem.choosePayType,
                orderData: JSON.stringify(orderData),
                marketPriceRate: parseFloat($('#marketPriceRate').val()),
                priceRate: parseFloat($('#priceRate').val()),
                yahooapikey: $("#yahooapikey").val(),
                yahooapisecret: $("#yahooapisecret").val()
            },
            success: function (response) {
                if (response.err) {
                    toastr.warning("請檢查Yahoo金鑰是否出錯");
                } else {
                    syncItem.report.push(response);
                    syncItem.done++;
                    //計算成功與失敗比數
                    //紀錄上傳成功且需要上架商品個數
                    if (response["@Status"] == "Success" || response["Action"] == "uploadImage") {
                        syncItem.success++;
                        syncItem.needOnline++;
                        if (response["Action"] == "uploadImage") {
                            syncItem.failUploadImg++;
                        }
                    } else {
                        syncItem.fail++;
                    }
                    //所有商品都上傳完畢
                    if (syncItem.done >= syncItem.needUploadItemsAmt){
                        //執行上架
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
                item: JSON.stringify(data),
                yahooapikey: $("#yahooapikey").val(),
                yahooapisecret: $("#yahooapisecret").val()
            },
            success: function (response) {
                //確認所有該上架的商品皆上架
                syncItem.needOnline--;
                if(syncItem.needOnline <= 0) {
                    syncItem.syncing = false;
                    syncItem.selectPayTypeAndShipType = false;
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    }
});
