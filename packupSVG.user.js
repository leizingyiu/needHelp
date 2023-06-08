
// ==UserScript==
// @name        packupSVG
// @namespace   leizingyiu.net
// match        *://*/*.svg*
// @include     /file.*svg/
// @grant       none
// @version     1.0
// @author      leizingyiu
// @description 2023/5/24 09:41:34
//
// @grant    GM_registerMenuCommand
// @require  https://github.com/leizingyiu/multKeys/raw/main/multKeysObj.js
// @require  https://cdn.bootcdn.net/ajax/libs/jszip/3.10.0/jszip.min.js


// ==/UserScript==


const m = new multKeysObj();

m.register(['alt', 's'],
    () => {

        console.log('alt s!!!');
        // console.log(document.querySelector('svg').outerHTML);



        // let zip = new JSZip();
        // const downloadFn = function () {
        //     console.log(document.querySelector('svg').outerHTML);

        //     zip.generateAsync({ type: 'blob' }).then(content => {
        //         const link = document.createElement('a');
        //         link.href = URL.createObjectURL(content);
        //         link.download = 'images.zip';
        //         // link.click();
        //     });
        // };

        // [...document.querySelectorAll('image')].filter(i =>
        //     (!Boolean(i.getAttribute('xlink:href').match(/^data/)))
        // ).map((i, arr) => {
        //     let imgFileName = i.getAttribute('xlink:href');


        //     let reader = new FileReader();

        //     reader.readAsDataURL(file);
        //     reader.onload = function (e) {

        //     }
        //     fetch(imgFileName)
        //         .then(response => response.blob())
        //         .then(imageBlob => {
        //             zip.file(imgFileName, imageBlob);
        //             if (zip.files.length === imgSrcList.length) {
        //                 downloadFn();

        //             }
        //         });


        // });

        function readFile(filePath) {
            console.log(filePath);
            const svgUrl = document.querySelector('svg').baseURI;
            const baseUrl = svgUrl.slice(0, svgUrl.lastIndexOf('/') + 1);
            const ofilePath = filePath;
            filePath = baseUrl + filePath;

            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    resolve(fileReader.result);
                };
                fileReader.onerror = () => {
                    console.log('error', fileReader.error);
                    reject(fileReader.error);
                };
                console.log(new File([filePath], ofilePath));

                fileReader.readAsArrayBuffer(new File([filePath], ofilePath));
            });
        }

        async function zipLocalFiles(filePaths) {
            console.log('zipLocalFiles');

            const zip = new JSZip();

            for (const filePath of filePaths) {
                const fileContent = await readFile(filePath);
                zip.file(filePath, fileContent);
            }

            zip.file(
                decodeURIComponent(document.querySelector('svg').baseURI).split(/\//).pop(),
                document.querySelector('svg').outerHTML
            );

            console.log('the last one? ', zip.files, zip);


            zip.generateAsync({ type: "blob" }).then(function (content) {
                // see FileSaver.js
                saveAs(content, "example.zip");
            });



            // 生成 ZIP 文件并下载
            zip.generateAsync({ type: 'blob' }).then(content => {
                console.log("generateAsync");

                var svgNS = "http://www.w3.org/2000/svg";
                const link = document.createElementNS(svgNS, 'a');
                link.href = URL.createObjectURL(content);
                link.download = 'files.zip';
                document.querySelector('svg').appendChild(link);
                link.click();
                console.log(link);
                // link.parentElement.removeChild(link);
            });

            zip.generateAsync({
                type: 'blob'
            }).then(function (content) {
                console.log("generateAsync2 ");

                var svgNS = "http://www.w3.org/2000/svg";
                var filename = 'svgPreview' + '.zip';
                var el = document.createElementNS(svgNS, 'a');
                el.download = filename;
                el.style.display = 'none';
                el.href = URL.createObjectURL(content);
                document.body.appendChild(el);
                el.click();
                // document.body.removeChild(el);
            });

        }

        let imgsLinks = [...document.querySelectorAll('image')].filter(i => (!Boolean(i.getAttribute('xlink:href').match(/^data/)))).map(i => i.getAttribute('xlink:href'));

        zipLocalFiles(imgsLinks);

        console.log('alt s!!!', imgsLinks);


        // Object.keys(files).map(k => {
        //     let file = files[k];
        //     console.log(file);
        //     zip.file(file.name, file.content);
        // });


        // zip.file('index.html', html.outerHTML);


    },
    () => {

    },
    false);
