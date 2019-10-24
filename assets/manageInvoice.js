$(document).ready(function () {

    window.Page = [];

    toastr.options = {
        "closeButton": true,
        "positionClass": "toast-top-right",
        "showDuration": "0",
        "hideDuration": "1000",
        "timeOut": "2000",
        "extendedTimeOut": "1000"
    }

    window.genInv = new Vue({
        el: "#geninv",
        data: {
            invoiceList: {},
            loading: 0,
            page: 1,
            orderlist: [],
            checkAmt: 0,
            pageAmt: 0,
            ordersCheck: [],
            hasSelectAll: false
        },
        filters: {
            time: function (value) {
                var time = new Date(value * 1000);
                return time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate() + " " + ((time.getHours() < 10) ? ("0" + time.getHours()) : (time.getHours())) + ":" + ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : (time.getMinutes()));
            }
        },
        watch: {
            page: function (page) {
                //換頁
                page = page - 1;
                genInv.orderlist = [];
                for (var i = page * 50; i < (page + 1) * 50 && i < Page.length; i++) {
                    genInv.orderlist.push(Page[i]);
                }
                genInv.checkAmt = 0;
                genInv.ordersCheck = [];
                genInv.hasSelectAll = false;
            },
            ordersCheck: function (value) {
                //打勾
                genInv.checkAmt = value.length;
            }
        },
        methods: {
            search: function () {
                if ($("#tt").val() != "" && $("#tf").val() != "") {
                    //時間範圍小於15日
                    if ((Math.floor(new Date($("#tt").val()).getTime() / 1000) - Math.floor(new Date($("#tf").val()).getTime() / 1000)) <= 15 * 86400) {
                        //開始查詢
                        genInv.orderlist = [];
                        genInv.loading = 1;
                        $.ajax({
                            url: '/orders/byStatusAndUpdateTime',
                            type: 'POST',
                            data: {
                                tt: $("#tt").val(),
                                tf: $("#tf").val(),
                                page: 0,
                                status: $("#orderStatus").val(),
                                shopeesecret: $("#shopeesecret").val(),
                                shopeeshopid: $("#shopeeshopid").val(),
                                shopeepartnerid: $("#shopeepartnerid").val(),
                                paytwogoid: $("#paytwogoid").val(),
                                paytwogohashkey: $("#paytwogohashkey").val(),
                                paytwogohashiv: $("#paytwogohashiv").val()
                            },
                            success: function (response) {
                                Page = [];
                                if (response.orders) {
                                    for (var i in response.invoices) {
                                        genInv.invoiceList[response.invoices[i].sn] = response.invoices[i];
                                    }
                                    for (var i in response.orders) {
                                        if (
                                            (
                                                response.orders[i].order_status == "CANCELLED" ||
                                                response.orders[i].order_status == "TO_RETURN"
                                            ) &&
                                            genInv.invoiceList[response.orders[i].ordersn]
                                        ) {
                                            Page.push(response.orders[i]);
                                        }
                                    }
                                    if (response.more === true) {
                                        getNextPage(1)
                                    } else {
                                        sortPage();
                                        //查詢結束
                                        for (var j = 0; j < 50 && j < Page.length; j++) {
                                            genInv.orderlist.push(Page[j]);
                                        }
                                        genInv.page = 1;
                                        genInv.loading = 0;
                                        genInv.checkAmt = 0;
                                        genInv.pageAmt = Math.floor(Page.length / 50) + 1;
                                        genInv.ordersCheck = [];
                                        genInv.hasSelectAll = false;
                                    }
                                } else {
                                    genInv.loading = 0;
                                    toastr.warning("請檢查蝦皮金鑰是否出錯");
                                }
                            }
                        });
                    } else {
                        alert("日期間隔請設定在15天內");
                    }
                }
            },
            discountInvoice: function (ordersn) {
                discountInvoice(ordersn);
            },
            invalidInvoice: function (ordersn) {
                invalidInvoice(ordersn);
            },
            showDetail: function (ordersn) {
                getOrder(ordersn);
            },
            selectAll: function () {
                if (!genInv.hasSelectAll) {
                    for (var i in genInv.orderlist) {
                        if (! genInv.invoiceList[genInv.orderlist[i].ordersn]) {
                            genInv.ordersCheck.push(genInv.orderlist[i].ordersn);
                        }
                    }
                    genInv.hasSelectAll = true;
                } else {
                    genInv.ordersCheck = [];
                    genInv.hasSelectAll = false;
                }
            },
            allDateGenInvoice: function () {
                for (var i in Page) {
                    if (Page[i].order_status == 'COMPLETED' && ! genInv.invoiceList[Page[i].ordersn]) {
                        genInvoice(Page[i].ordersn);
                    }
                }
            },
            allSelectGenInvoice: function () {
                var tempArr = genInv.ordersCheck;
                for (var i in tempArr) {
                    genInvoice(tempArr[i]);
                }
                genInv.hasSelectAll = false;
            },
            setting: function () {
                $("#settingForm").modal("show");
            }
        }
    });

    var orderDetail = new Vue({
        el: "#orderDetail",
        data: {
            order: {},
            show: false
        },
        filters: {
            time: function (value) {
                var time = new Date(value * 1000);
                return time.getFullYear() + "/" + (time.getMonth() + 1) + "/" + time.getDate() + " " + ((time.getHours() < 10) ? ("0" + time.getHours()) : (time.getHours())) + ":" + ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : (time.getMinutes()));
            }
        }
    });

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

    function getNextPage(page, cb) {
        $.ajax({
            url: '/orders/byStatusAndUpdateTime',
            type: 'POST',
            data: {
                tt: $("#tt").val(),
                tf: $("#tf").val(),
                page: page,
                status: $("#orderStatus").val(),
                shopeesecret: $("#shopeesecret").val(),
                shopeeshopid: $("#shopeeshopid").val(),
                shopeepartnerid: $("#shopeepartnerid").val(),
                paytwogoid: $("#paytwogoid").val(),
                paytwogohashkey: $("#paytwogohashkey").val(),
                paytwogohashiv: $("#paytwogohashiv").val()
            },
            success: function (response) {
                for (var i in response.invoices) {
                    genInv.invoiceList[response.invoices[i].sn] = response.invoices[i];
                }
                for (var i in response.orders) {
                    if (
                        (
                            response.orders[i].order_status == "CANCELLED" ||
                            response.orders[i].order_status == "TO_RETURN"
                        )
                        && genInv.invoiceList[response.orders[i].ordersn]
                    ) {
                        Page.push(response.orders[i]);
                    }
                }
                if (response.more === true) {
                    getNextPage(page + 1);
                } else {
                    sortPage();
                    for (var i = 0; i < 50 && i < Page.length; i++) {
                        genInv.orderlist.push(Page[i]);
                    }
                    genInv.page = 1;
                    genInv.loading = 0;
                    genInv.checkAmt = 0;
                    genInv.pageAmt = Math.floor(Page.length / 50) + 1;
                    genInv.ordersCheck = [];
                    genInv.hasSelectAll = false;
                }
            }
        });
    }

    function invalidInvoice(ordersn) {
        if (ordersn) {
            $.ajax({
                url: '/orders/' + ordersn + '/invalidInvoice',
                type: 'POST',
                data: {
                    shopeesecret: $("#shopeesecret").val(),
                    shopeeshopid: $("#shopeeshopid").val(),
                    shopeepartnerid: $("#shopeepartnerid").val(),
                    paytwogoid: $("#paytwogoid").val(),
                    paytwogohashkey: $("#paytwogohashkey").val(),
                    paytwogohashiv: $("#paytwogohashiv").val(),
                    invurl: $("#invurl").val()
                },
                success: function (response) {
                    console.log(response);
                    genInv.invoiceList[ordersn].status = 1;
                    genInv.$forceUpdate();
                }
            });
        } else {
            toastr.warning('訂單編號有誤');
        }
    }

    function discountInvoice(ordersn) {
        if (ordersn) {
            $.ajax({
                url: '/orders/' + ordersn + '/discountInvoice',
                type: 'POST',
                data: {
                    shopeesecret: $("#shopeesecret").val(),
                    shopeeshopid: $("#shopeeshopid").val(),
                    shopeepartnerid: $("#shopeepartnerid").val(),
                    paytwogoid: $("#paytwogoid").val(),
                    paytwogohashkey: $("#paytwogohashkey").val(),
                    paytwogohashiv: $("#paytwogohashiv").val(),
                    invurl: $("#invurl").val()
                },
                success: function (response) {
                    console.log(response);
                    genInv.invoiceList[ordersn].status = 2;
                    genInv.$forceUpdate();
                }
            });
        } else {
            toastr.warning('訂單編號有誤');
        }
    }

    function getOrder(ordersn) {
        $.ajax({
            url: '/orders/' + ordersn + '/detail',
            type: 'POST',
            data: {
                shopeesecret: $("#shopeesecret").val(),
                shopeeshopid: $("#shopeeshopid").val(),
                shopeepartnerid: $("#shopeepartnerid").val(),
                paytwogoid: $("#paytwogoid").val(),
                paytwogohashkey: $("#paytwogohashkey").val(),
                paytwogohashiv: $("#paytwogohashiv").val()
            },
            success: function (response) {
                orderDetail.order = response;
                orderDetail.show = true;
                $("#orderDetail").modal('show');
                console.log(response);
            }
        });
    }

    function sortPage() {
        Page.sort(function (a, b) {
            return a.update_time - b.update_time
        });
    }

    $('#datetimepickertf').datetimepicker({
        format: "YYYY/MM/DD"
    });

    $('#datetimepickertt').datetimepicker({
        format: "YYYY/MM/DD",
        useCurrent: false
    });

    $("#datetimepickertf").on("dp.change", function (e) {
        $('#datetimepickertt').data("DateTimePicker").minDate(e.date);
    });

    $("#datetimepickertt").on("dp.change", function (e) {
        $('#datetimepickertf').data("DateTimePicker").maxDate(e.date);
    });
});