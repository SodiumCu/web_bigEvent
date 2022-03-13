$(function() {
    $('#link-reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    $('#link-login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 从layui中获取form对象
    let form = layui.form;
    let layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            //if (value !== $('#pwd').val()) {
            //     return '两次输入的密码不一致'
            // }
            let pwd = $('.reg-box [name = password]').val();
            if (value !== pwd) {
                return '两次输入的密码不一致'
            }

        }
    });

    // 监听注册表单提交事件
    $('#form_reg').on('submit', function(e) {
        // 1.阻止默认的提交行为
        e.preventDefault();
        // 2.发起Ajax的Post请求
        $.post('/api/reguser', {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录');
            $('#link-login').click();
            // 提交表单后清空表单
            $('#form_reg')[0].reset();
        })
    })

    //监听登陆表单提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单内容
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 将登陆成功得到的token字符串,保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/Ajax/小项目-大事件后台/index.html';
            }
        })
    })
})