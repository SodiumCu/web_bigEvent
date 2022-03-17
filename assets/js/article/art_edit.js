$(function() {

    //定义全局变量
    let layer = layui.layer;
    let form = layui.form;
    // 先从 localStorage 中拿到id
    let id = localStorage.getItem('id');

    var $image = null;
    // 初始化文章加载
    initEditCate();

    // 定义加载文章的函数
    function initEditCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('加载文章失败！');
                };
                template.defaults.imports.cate_id = res.data.cate_id;
                drawEdit(res.data);
            }
        })
    }

    // 渲染页面函数
    function drawEdit(data) {
        let htmlStr = template('tpl-edit', data);
        $('#form-edit').html(htmlStr);
        // 初始化富文本编辑器
        initEditor();

        // 1. 初始化图片裁剪器
        $image = $('#image')

        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }

        // 3. 初始化裁剪区域
        $image.cropper(options);

        // 渲染文章分类的下拉框
        initCate();
    }

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                // 调用模板引擎,渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render()方法
                form.render();
            }
        })
    }

    // 通过代理为选择封面按钮绑定点击事件
    $('body').on('click', '#btnChooseImage', function() {
        $('#coverFile').click();
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('body').on('change', '#coverFile', function(e) {
        // 获取到用户选择的文件列表数组
        let file = e.target.files;
        // 判断用户是否选择了文件
        if (file.length === 0) {
            return
        }
        // 根据文件，创建对应的URL地址
        let newImgURL = URL.createObjectURL(file[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    let article_state = '已发布';
    // 为存为草稿按钮绑定点击事件
    $('body').on('click', '#btnSave2', function() {
        article_state = '草稿';
    })

    // 注册文章更新事件
    $('#form-edit').on('submit', function(e) {
        // 1.阻止默认提交事件
        e.preventDefault();
        // 2.基于form表单 快速创建FormData对象
        let fd = new FormData($(this)[0]);

        fd.append('Id', id);

        // 3.将文章的发布状态，存到fd中
        fd.append('state', article_state);

        // 4.将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象存储到fd中
                fd.append('cover_img', blob);

                // 打印fd对象里的内容
                // fd.forEach(function(v, k) {
                //     console.log(k, v);
                // })

                // 6.发起ajax请求
                editArticle(fd);
            });

    })

    // 定义AJAX请求
    function editArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据
            // 必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 修改文章成功后，将 localStorage 里的id数据删除
                localStorage.removeItem('id');
                // 修改文章成功后，跳转到文章列表页面
                location.href = '../article/art_list.html';
            }
        })
    }
})