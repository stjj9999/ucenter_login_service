var timer;
var codeId;


function getLoginQrCode(key) {
    $(".id_scan_qr_code").attr('src', qrCodeLoading);
    clearInterval(timer);
    $.post('/admin/api/scan/get_bind', {
        'id': key,
        '_token': csrfToken
    }, function (result) {
        if (result['code'] == '00') {
            $('#grid-modal-' + key + '-scan_bind_code .id_scan_mark').hide();
            $('#grid-modal-' + key + '-scan_bind_code .id_scan_time_mark').hide();
            $('#grid-modal-' + key + '-scan_bind_code .id_tip1').show();
            $('#grid-modal-' + key + '-scan_bind_code .id_tip2').hide();
            $('#grid-modal-' + key + '-scan_bind_code .id_tip3').hide();
            $('#grid-modal-' + key + '-scan_bind_code .id_scan_qr_code').attr('src', result['data'][0]['url']);
            codeId = result['data'][0]['code_id'];
            timer = setInterval(function () {
                getQrCodeStatus(key);
            }, 1000);
        } else {
            toast(result['msg']);
        }
    });
}

function getQrCodeStatus(key) {
    $.post('/admin/api/scan/code_status', {code_id: codeId}, function (result) {
        if (result['code'] == '00') {
            var status = result['data'][0];
            if (status == 0) {
                $('#grid-modal-' + key + '-scan_bind_code .id_scan_mark').hide();
                $('#grid-modal-' + key + '-scan_bind_code .id_scan_time_mark').hide();
                $('#grid-modal-' + key + '-scan_bind_code .id_tip1').show();
                $('#grid-modal-' + key + '-scan_bind_code .id_tip2').hide();
                $('#grid-modal-' + key + '-scan_bind_code .id_tip3').hide();
            } else if (status == 1) {
                $('#grid-modal-' + key + '-scan_bind_code .id_scan_mark').show();
                $('#grid-modal-' + key + '-scan_bind_code .id_scan_time_mark').hide();
                $('#grid-modal-' + key + '-scan_bind_code .id_tip1').hide();
                $('#grid-modal-' + key + '-scan_bind_code .id_tip2').show();
                $('#grid-modal-' + key + '-scan_bind_code .id_tip3').hide();
            } else if (status == 2) {
                $('#grid-modal-' + key + '-scan_bind_code .id_scan_mark').hide();
                $('#grid-modal-' + key + '-scan_bind_code .id_scan_time_mark').show();
                $('#grid-modal-' + key + '-scan_bind_code .id_tip1').hide();
                $('#grid-modal-' + key + '-scan_bind_code .id_tip2').hide();
                $('#grid-modal-' + key + '-scan_bind_code .id_tip3').show();
                clearInterval(timer);
            } else if (status == 3) {
                clearInterval(timer);
                toast("绑定成功");
                window.close();
            }
        } else {
            toast(result['msg']);
        }
    });
}


/**
 * 土司
 * @param msg
 */
function toast(msg) {
    let url = arguments[1] ? arguments[1] : "";
    var timestamp = Date.parse(new Date());
    let id = "toast_" + timestamp + "_" + get_random_str();
    var str = '<div style="position: fixed;\n' +
        '    background: #666666;\n' +
        '    color: #ffffff;\n' +
        '    text-align: center;\n' +
        '    min-height: 1.2rem;\n' +
        '    line-height: 1.2rem;\n' +
        '    width: 200px;\n' +
        '    padding: 1rem 2%;\n' +
        '    left: 50%;\n' +
        '    margin-left: -100px;\n' +
        '    bottom: 20%;\n' +
        '    font-size: .5rem;\n' +
        '    opacity: .8;\n' +
        '    overflow:hidden;\n' +
        '    white-space:normal;\n' +
        '    word-break:break-all;\n' +
        '    border-radius: .5rem;" id="' + id + '">' + msg + '</div>';
    $("body").append(str);
    $("#" + id).fadeIn();
    setTimeout(function () {
        $("#" + id).fadeOut('1000', function () {
            $("#" + id).remove();
            if (url != '') {
                window.location.href = url;
            }
        });
    }, 2000);
}

/**
 * 获得随机字符串
 * @param len
 * @returns {string}
 */
function get_random_str(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
