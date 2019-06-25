const img     = document.querySelector("#image");

var parentTemplate = document.querySelector("#parent-top");
var templateTop = document.querySelector("#data-top").innerHTML;
let temp = "";
let similarity ="";
const fetchData = ()=>{

	var canvas = document.createElement("canvas");
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	console.log(img.src);

	fetch('https://trace.moe/api/search', {
		method: 'POST',
		body: JSON.stringify({image: canvas.toDataURL('image/jpeg', 0.8)}),
		headers: { 'Content-Type': 'application/json' }
	}).then(res=>res.json()).then(result=>{
		console.log(result);
		temp = "";
		const anilist_id = result.docs[0].anilist_id;
		const tokenthumb = result.docs[0].tokenthumb;
		const filename   = result.docs[0].filename;
		const at 		 = result.docs[0].at;
		let similar   	 = result.docs[0].similarity;

		similarity = `${similar.toString().replace("0.","").substr(0,2)}%`;

		// similarity = similarity + similar
		// .substr(2);


		const videoUrl = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;

		temp = temp + templateTop
		.replace('{jpTitle}', result.docs[0].title)
		.replace('{rmTitle}', result.docs[0].title_romaji)
		.replace('{enTitle}', result.docs[0].title_english)
		.replace('{cnTitle}', result.docs[0].title_chinese)

		.replace('{eps}', result.docs[0].episode)
		.replace('{from}', convertTime(result.docs[0].from))
		.replace('{to}', convertTime(result.docs[0].to + 1))
		.replace('{season}', result.docs[0].season)
		.replace('{pvVideo}',videoUrl)
		.replace('{similarity}',similarity)

		parentTemplate.innerHTML = temp;
		$(window).scrollTo(document.querySelector(".data-wrapper"),800);
	});
}



$(function upImage() {
    $(":file").change(function () {
		if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }

		setTimeout(function(){
			fetchData();
		}, 1000)

    });
});

function convertTime(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);


 	var hDisplay = h < 10 ? `0${h}:`: h;
    var mDisplay = m < 10 ? `0${m}:`: m;
    var sDisplay = s < 10 ? `0${s}`: s;


    return hDisplay + mDisplay + sDisplay; 
}

// var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
//     var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
//     var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

function imageIsLoaded(e) {
    $('#image').attr('src', e.target.result);
    $('.img-wrapper').addClass('height-auto');
};

