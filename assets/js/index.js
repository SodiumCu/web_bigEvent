$(function() {
    // 调用getUserInfo获取用户信息
    getUserInfo();

    // 退出按钮的功能
    let layer = layui.layer;
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            // 1.清空本地存储中的token
            localStorage.removeItem('token');

            // 2.跳转到登陆页面
            location.href = '/Ajax/小项目-大事件后台/login.html';
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers就是请求头配置对象
        // headers: {
        //     //如果没有token那就赋值为空字符串
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layui.layer.msg('数据请求失败');
                }
                renderAvatar(res.data);
            }
            // 无论成功还是失败，最终都会调用 complete 回调函数
            // 在complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
            // complete: function(res) {
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 1.强制清空 token 防止一些利用非法token访问
            //         localStorage.removeItem('token');
            //         // 2.强制跳转到登陆页面
            //         location.href = '/Ajax/小项目-大事件后台/login.html';
            //     }
            // }
    })
}

// 渲染用户的信息
function renderAvatar(user) {
    // 1.获取用户的名称
    let name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('#welcome').html(`欢迎&nbsp&nbsp${name}`);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.text-avater').hide();
        $('.layui-nav-img').prop('src', user.user_pic);
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide();
        // 取出用户名第一个字母或第一个字 第一个字母可能是小写 要转换成大写
        let first = name[0].toUpperCase();
        $('.text-avater').html(first);
    }
}