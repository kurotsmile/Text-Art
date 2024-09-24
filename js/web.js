class Web{

    style_cur=null;

    onLoad(){
        cr.get_json("config.json",(config_data)=>{
            cr.site_url=config_data.site_url;
            cr_firestore.id_project = config_data.id_project;
            cr_firestore.api_key = config_data.api_key;
            w.show_home();
        });
    }

    show_home(){
        $("#all-item-styles").html("");
        cr_firestore.list("style",data=>{
            w.style_cur=data[0];
            $.each(data,function(index,style){
                $("#all-item-styles").append(w.item_style_box(style));
            });
        });
    }

    item_style_box(data){
        var emp_box=$(`
            <div class="col">
                <div class="card book-card h-100">
                    <img src="${data.txt0}" class="card-img-top w-100" alt="Book 1">
                    <div class="card-body">
                        <h5 class="card-title">${data.name}</h5>
                        <p class="card-text">
                            <small class="text-muted" style="font-size:12px;">${data.tip}</small>
                            
                        </p>
                        <button class="btn btn-sm btn-dark btn-used"><i class="fas fa-pen-nib"></i> Used</button>
                    </div>
                </div>
            </div>
        `);

        $(emp_box).find(".btn-used").click(function(){
            cr.top();
            w.style_cur=data;
            return false;
        });

        $(emp_box).click(()=>{
            w.show_style_by_data(data);
        });
        return emp_box;
    }

    show_style_by_data(data){
        var html='';
        cr.top();
        $("#head_banner").html("");
        $("#head_banner").html('<h1 class="display-4 mt-5">'+data.name+'</h1>');
        $("#all-item-styles").html("");
        html+=data.tip;
        html+='<div class="w-100">';
        for(var i=0;i<26;i++){
            html+='<img class="img-thumbnail rounded float-left m-2" style="width:90px;" src="'+data["txt"+i]+'"/>';
        }
        html+='</div>';
        $("#all-item-styles").html(html);
    }

    create_text_art(){
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
        var val_txt=$("#inp_text_art").val();
        for (var i = 0; i < val_txt.length; i++) {
            let index_c=findCharPosition(val_txt[i]);
            var emp_pic='';
            if(index_c!=-1)
                emp_pic='<img style="float: left;width: 80px;height:80px" src="'+w.style_cur["txt"+index_c]+'"/>';
            else
                emp_pic='<span style="float: left;width: 40px;height:80px">&nbsp</span>';
            $("#out_pic_art").append(emp_pic);
        }
    }
}

var w=new Web();

$(document).ready(function() {
    w.onLoad();
});