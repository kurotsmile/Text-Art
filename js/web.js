class Web{

    style_cur=null;
    text_data="";
    ver="1.0";

    onLoad(){
        cr.get_json("config.json",(config_data)=>{
            cr.site_url=config_data.site_url;
            cr_firestore.id_project = config_data.id_project;
            cr_firestore.api_key = config_data.api_key;
            cr.setColor("#740027");
            
            w.text_data=new Date().toLocaleString('en-us', { month: 'long' });

            cr_firestore.list("setting",(datas)=>{
                $.each(datas,function(index,setting){
                    if(setting.id_doc=="setting_paypal"){
                        cr_shopping.onLoad("#w1W8yugUrrw3MifUfiGU",setting.api_paypal,setting.api_paypal_scenrest);
                    }
                });

                var p=cr.arg("p");
                if(p=="all_style") w.show_all_styles();
                else if(p=="cart") w.show_cart();
                else if(p=='checkout') w.show_checkout();
                else if(p=="style"){
                    var id_style=cr.arg("id");
                    w.show_style_by_id(id_style);
                }
                else w.show_home();
                cr.show_menu_list("#menu_top","menu",()=>{
                    cr_shopping.update_cart();
                });

            });
        });
    }

    show_home(){
        var html_home='';
        html_home+='<h1 class="text-center mb-4 mt-5">Style</h1>';
        html_home+='<div class="row row-cols-1 row-cols-md-4 g-4 mt-5" id="all-item-styles"></div>';
        w.loading();
        var q=new Firestore_Query("style");
        q.add_where("in_home","1");
        q.set_limit(8);
        q.get_data(data=>{
            $("#page_container").html(html_home);
            data.sort(function(a, b) { return parseInt(a.order) - parseInt(b.order);});
            w.style_cur=data[0];

            $("#inp_text_art").val(w.text_data);
            w.show_return_text(w.text_data);

            $.each(data,function(index,style){
                $("#all-item-styles").append(w.item_style_box(style));
            });

            $("#page_container").append('<div class="w-100 mt-5 mb-5 text-center"><button class="btn btn-dark" onclick="w.show_all_styles();return false;"><i class="fas fa-angle-double-right"></i> See more</button></div>');
        });
    }

    show_cart(){
        cr.top();
        cr.change_title("Cart","index.html?p=cart");
        w.banner_text('<i class="fas fa-shopping-cart"></i> Cart');
        $("#page_container").empty();
        var emp_nav=$(w.nav("Cart"));
        $(emp_nav).addClass("mt-5");
        $("#page_container").append(emp_nav);
        $("#page_container").append(cr_shopping.page_cart(()=>{
            w.show_checkout();
        }));
    }

    item_style_box(data){
        var emp_box=$(`
            <div class="col">
                <div class="card book-card h-100" role="button">
                    <img src="${data.txt0}" class="card-img-top w-100" alt="Book 1">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}</h5>
                        <p class="card-text fs-3">$${parseFloat(data.price).toFixed(2)}</p>
                        <p class="card-text">
                            <small class="text-muted multiline-truncate" style="font-size:12px;">${data.tip}</small>
                        </p>
                        <button class="btn btn-sm btn-dark btn-used"><i class="fas fa-pen-nib"></i> Try it out</button>
                        <button class="btn btn-sm  btn-outline-dark btn-cart"><i class="fas fa-cart-plus"></i> Add cart</button>
                    </div>
                </div>
            </div>
        `);

        $(emp_box).find(".btn-used").click(function(){
            cr.top();
            w.style_cur=data;
            w.show_return_text(w.text_data);
            return false;
        });

        $(emp_box).find(".btn-cart").click(function(){
            cr_shopping.add_cart(data);
            return false;
        });

        $(emp_box).click(()=>{
            w.show_style_by_data(data);
        });
        return emp_box;
    }

    show_style_by_data(data){
        cr.change_title(data.name,"index.html?p=style&id="+data.id_doc);
        var html='';
        w.banner_text(data.name);
        cr.top();

        html+='<div class="row mt-5 mb-5">';
            html+='<div class="col-10">';
                html+=w.nav(data.name);
                
                html+=data.tip;
                html+='<div class="w-100">';
                for(var i=0;i<26;i++){
                    html+='<img class="img-thumbnail rounded float-left m-2" style="width:90px;" src="'+data["txt"+i]+'"/>';
                }
                html+='</div>';
            html+='</div>';

            html+='<div class="col-2 text-center">';
                html+='<b class="fs-5">Price</b>';
                html+='<p class="fs-2">$'+parseFloat(data.price).toFixed(2)+'</p>';
                html+='<div class="btn btn-dark w-100 m-1 btn-lg" id="btn_page_used"><i class="fas fa-pen-nib"></i> Try it out</div>';
                html+='<div class="btn btn-outline-dark btn-cart  w-100 m-1" id="btn_page_add_cart"><i class="fas fa-cart-plus"></i> Add cart</div>';
                html+='<div class="btn btn-dark w-100 m-1" id="btn_page_share"><i class="fas fa-share-alt"></i> Share</div>';
            html+='</div>';

        html+='</div>';

        var emp_page=$(html);
        $(emp_page).find("#btn_page_used").click(()=>{
            cr.top();
            w.style_cur=data;
            w.banner_editor();
            w.show_return_text(w.text_data);
            return false;
        });

        $(emp_page).find("#btn_page_share").click(()=>{
            cr.share();
            return false;
        });

        $(emp_page).find("#btn_page_add_cart").click(()=>{
            cr_shopping.add_cart(data);
            return false;
        });

        $("#page_container").empty();
        $("#page_container").append(emp_page);
    }

    create_text_art(){
        w.text_data=$("#inp_text_art").val();
        w.show_return_text(w.text_data);
    }

    show_return_text(val_txt){
        w.banner_editor();
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        
        function findCharPosition(char) {
            const index = alphabet.indexOf(char.toUpperCase());
            if (index !== -1) {
                return index ;
            } else {
                return -1;
            }
        }

        $("#out_pic_art").html('');
        for (var i = 0; i < val_txt.length; i++) {
            let index_c=findCharPosition(val_txt[i]);
            var emp_pic='';
            if(index_c!=-1)
                emp_pic='<div class="image-container"><img src="'+w.style_cur["txt"+index_c]+'"/></div>';
            else
                emp_pic='<span style="width: 40px;">&nbsp</span>';
            $("#out_pic_art").append(emp_pic);
        }
    }

    banner_text(title='Welcome to Text Art',subtitle='where creativity meets the written word! At Text Art, we offer a fantastic online platform for those passionate about creating and exploring '){
        var html='';
        html+='<h1 class="display-4 mt-5">'+title+'</h1>';
        html+='<p class="lead">'+subtitle+'</p>';
        $("#head_banner").html(html);
    }

    banner_editor(){
        w.banner_text();
        var emp_editor=$(`
            <div class="container">
                <div class="row mt-5 mt-5">
                    <div class="col-12 col-md-4 col-lg-4 text-center">
                        <div class="card mb-4 shadow-sm bg-t">
                            <div class="card-header"><h4 class="my-0 font-weight-normal">Create Text</h4></div>
                            <div class="card-body">
                                <span id="editor_create_tip" class="text-muted mb-2"></span>
                                <input class="form-control mb-2 mt-2" id="inp_text_art" placeholder="Enter data here..." value="${w.text_data}" />
                                <button type="button" class="btn btn-sm btn-block btn-dark m-1" onclick="w.create_text_art();return false;"><i class="fas fa-play-circle"></i> Create</button>
                                <button type="button" class="btn btn-sm btn-block btn-outline-dark m-1" onclick="cr.paste('#inp_text_art');return false;"><i class="fas fa-clipboard"></i> Paste</button>
                            </div>    
                        </div>
                    </div>

                    <div class="col-12 col-md-8 col-lg-8 text-center">
                        <div class="card mb-4 shadow-sm bg-t">
                            <div class="card-header"><h4 class="my-0 font-weight-normal">Result (${w.style_cur.name})</h4></div>
                            <div class="card-body image-gallery" id="out_pic_art"></div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $(emp_editor).find("#editor_create_tip").html("Enter the content you want to create artistic text");
        $("#head_banner").append(emp_editor);
    }

    show_style_by_id(id){
        w.loading();
        cr_firestore.get("style",id,data=>{
            w.show_style_by_data(data);
        },()=>{
            w.show_all_styles(id);
        });
    }

    show_all_styles(){
        cr.top();
        cr.change_title("All Style","index.html?p=all_style");
        w.banner_text("All Style");
        w.loading();
        cr_firestore.list("style",data=>{
            $("#page_container").html('<div class="row row-cols-1 row-cols-md-4 g-4 mt-5" id="all-item-styles"></div>');
            data.sort(function(a, b) { return parseInt(a.order) - parseInt(b.order);});
            $.each(data,function(index,style){
                $("#all-item-styles").append(w.item_style_box(style));
            });
        });
    }

    loading(){
        $("#page_container").html('<div class="row text-center mt-5 mb-5"><div class="col-12 fs-4"><i class="fas fa-spinner fa-spin"></i><br/> Loading...</div></div>');
    }

    nav(name_page_cur){
        var html='';
        html+='<nav aria-label="breadcrumb">';
        html+='<ol class="breadcrumb">';
            html+='<li class="breadcrumb-item"><a href="#" onclick="w.show_home();return false;"><i class="fas fa-home"></i> Home</a></li>';
            html+='<li class="breadcrumb-item"><a href="#" onclick="w.show_all_styles();return false;"><i class="fas fa-list"></i> Library</a></li>';
            html+='<li class="breadcrumb-item active" aria-current="page">'+name_page_cur+'</li>';
        html+='</ol>';
        html+='</nav>';
        return html
    }

    seach_web(){
        var inp_search_web=$("#inp_search_web").val();
        if(!cr.alive(inp_search_web)){
            cr.msg("Search keyword cannot be empty!","Search","warning");
            return false;
        }

        cr.change_title("Search results","index.html?p=search_results&key="+encodeURIComponent(inp_search_web));
        w.banner_text('<i class="fas fa-search"></i> Search results',inp_search_web);
        w.loading();
        cr_firestore.list("style",data=>{
            var list_style=[];
            
            data.sort(function(a, b) { return parseInt(a.order) - parseInt(b.order);});
            $.each(data,function(index,style){
                var key_check=style.name.toUpperCase();
                var key_seach=inp_search_web.toUpperCase();
                if(key_check.indexOf(key_seach)!=-1) list_style.push(style);
            });

            if(list_style.length>0){
                $("#page_container").html('<div class="row row-cols-1 row-cols-md-4 g-4 mt-5" id="all-item-styles"></div>');
                $.each(list_style,function(index,s){
                    $("#all-item-styles").append(w.item_style_box(s));
                });
            }else{
                var emp_empty=$(w.list_empty());
                emp_empty.addClass("mt-5 mb-3");
                $("#page_container").html(emp_empty);
            }
            
        });
    }

    list_empty(){
        var html='';
        html+='<div class="col-12 text-center"><div class="bg-light p-5 rounded"><b><i class="fas fa-sad-tear fa-lg"></i></b><br/>List is empty!</div></div>';
        return html;
    }

    show_checkout(){
        cr.top();
        cr.change_title("Checkout","index.html?p=checkout");
        w.banner_text("Checkout");
        $("#page_container").html(w.loading());
        cr.get("page/checkout.html?v="+w.ver,(data)=>{
            $("#page_container").empty().append(cr_shopping.page_checkout(data));
            cr_shopping.create_btn_checkout();
        },()=>{
            w.show_checkout();
        });
    }
}

var w=new Web();

$(document).ready(function() {
    w.onLoad();
});