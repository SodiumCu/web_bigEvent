$(function() {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    });
    //初始化信息
    initUserInfo();

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                console.log(res);
                // 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 为重置按钮注册事件
    $('#reset').on('click', function(e) {
        //组织表单的默认重置行为
        e.preventDefault();
        // 重新渲染表单
        initUserInfo();
    });

    // 监听注册表单提交事件
    $('#form_modified').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            //快速获取表单内容
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 调用父页面中的方法，重新渲染用户头像和用户信息 
                // window指的是当前页面 即子页面 parent则获取到了它的父页面
                window.parent.getUserInfo();
            }
        })
    })
})