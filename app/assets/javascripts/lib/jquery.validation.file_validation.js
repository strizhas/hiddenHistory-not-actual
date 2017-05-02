$(function() {
    $.validator.addMethod(
            "validate_file_type",
            function(val,elem) {
                console.log(elem.id);
                    var files    =   $('#'+elem.id)[0].files;
                console.log(files);
                for(var i=0;i<files.length;i++){
                    var fname = files[i].name.toLowerCase();
                    var re = /(\.jpg|\.png|\.jpeg)$/i;
                    if(!re.exec(fname))
                    {
                        console.log("File extension not supported!");
                        return false;
                    }
                }
                return true;
            },
            "Please upload pdf or doc or docx files"
    );


});