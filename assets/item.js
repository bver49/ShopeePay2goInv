$(document).ready(function () {
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
                var time = new Date(value);
                return time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate() + " " + ((time.getHours() < 10) ? ("0" + time.getHours()) : (time.getHours())) + ":" + ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : (time.getMinutes()));
            },
            status:function(value){
                switch(value){
                    case "Success":
                        return "同步成功"
                    case "Fail":
                        return "同步失敗"
                }
            }
        },
        mounted:function(){
            $.ajax({
                url: '/items',
                type: 'get',
                success: function (response) {
                    syncItem.items = response;
                }
            });
        },
        methods:{
            sync:function(){
                syncItem.syncing = true;
                syncItem.showreport = false;
                $.ajax({
                    url: '/items/syncshopeetoyahoo',
                    type: 'post',
                    success: function (response) {
                        syncItem.syncing = false;
                        if(response.report) {
                            console.log(response.report);
                            syncItem.report = response.report;
                            syncItem.showreport = true;
                            syncItem.success = response.success;
                            syncItem.fail = response.fail;
                            syncItem.failUploadImg = response.failUploadImg;
                            syncItem.shopeeItemsAmt = response.shopeeItemsAmt;
                            syncItem.needUploadItemsAmt = response.needUploadItemsAmt;
                            $.ajax({
                                url: '/items',
                                type: 'get',
                                success: function (items) {
                                    syncItem.items = items;
                                }
                            });
                        }
                    }
                });
            }
        }
    });

});
