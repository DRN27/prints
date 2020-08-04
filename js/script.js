import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js';
import { products } from './products.js';
import { authorPrints } from './author-prints.js';


new Vue({
    el: '#app',
    data() {
        return {
            medvedevaPrints: authorPrints.medvedeva,
            sykovaPrints: authorPrints.sykova,
            ceslerPrints: authorPrints.cesler,
            currentObj: products[0], 
            currentType: products[0].type[0],
            currentColor: products[0].type[0].colors[0],
            currentSize: products[0].type[0].colors[0].size[0],
            products: products,
            cesler: true,
            sykova: false,
            medvedeva: false,
            fileName: 'Загрузить принт',
            selectedPrintUrl: '',
            urlImg: '',
            file: '',
            dataUri: '',
            name: '',
            email: '',
            phone: '',
            modal: false,
            modalText: ''
        }
    },
    methods: {
        selectName(event) {
            this.products.forEach(el => {
                if (el.name === event.target.value) {
                    this.currentObj = el;
                }
            });
            this.currentType = this.currentObj.type[0];
            this.currentColor = this.currentObj.type[0].colors[0];
            this.currentSize = this.currentColor.size[0];
        },

        selectType(event) {
            this.products.forEach(item => {
                item.type.forEach(el => {
                    if(el.typeName == event.target.value) {
                        this.currentType = el;
                    }
                });
            });
            this.currentColor = this.currentType.colors[0];
            this.currentSize = this.currentColor.size[0];
        },

        selectColor(event) {
            this.products.forEach(item => {
                item.type.forEach(el => {
                    if(el.typeName == event.target.value) {
                        this.currentType = el;
                    }
                    el.colors.forEach(c => {
                        if(c.id == event.target.value) {
                            this.currentColor = c;
                        }
                    });
                        
                });
            });
            this.currentSize = this.currentColor.size[0];
        },

        selectSize(event) {
            this.currentSize = event.target.value;
        },

        selectCesler() {
            this.cesler = true;
            this.sykova = false;
            this.medvedeva = false;
        },

        selectSykova() {
            this.cesler = false;
            this.sykova = true;
            this.medvedeva = false;
        },

        selectMedvedeva() {
            this.cesler = false;
            this.sykova = false;
            this.medvedeva = true;
        },

        uploadPrint(event) {
            this.getImg(event);

            this.fileName = event.target.value.split('/').pop().split('\\').pop();
            this.urlImg = URL.createObjectURL(event.target.files[0]);
        },

        selectPrint(event) {
            this.selectedPrintUrl = event.toElement.parentElement.querySelector('img').src;
            this.fileName = this.selectedPrintUrl.split('/').pop().split('\\').pop();

            const img = event.toElement.parentElement.querySelector('img');
            const canvas = document.createElement("canvas");  
            canvas.width = img.width; 
            canvas.height = img.height;  
            const ctx = canvas.getContext("2d");  
            ctx.drawImage(img, 0, 0); 
            const dataURL = canvas.toDataURL("image/png");  
            this.dataUri = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");  

            location.href = '#selectPrint';
        },

        getImg(event) {
            this.file = event.srcElement.files[0];
            const reader = new FileReader();
            reader.readAsBinaryString(this.file);
            reader.onload = () => this.dataUri = "data:" + this.file.type + ";base64," + btoa(reader.result);
        },

        sendEmail(event) {
            event.preventDefault();
            if (this.dataUri === '')  {
                this.modalText = 'Выберите, пожалуйста, принт!'
                    this.modal = true;
                    setInterval(() => {
                        this.modal = false;
                    }, 4000);
            } else {
                const message = `
                    ${this.name} оставил заяку на печать. <br>
                    Контактный email: ${this.email} <br>
                    Контактный телефон: ${this.phone} <br>
                    ${this.currentObj.name} ${this.currentType.typeName} <br>
                    цвет: ${this.currentColor.name} <br>
                    размер: ${this.currentSize}
                `;
                Email.send({
                    SecureToken: "6d9bcc5d-21ce-4dc2-a621-926ad5a34b55",
                    To : 'rusbear101@yandex.ru',
                    From : "printrepublicmail@gmail.com",
                    Subject : "Новая заявка на printrepublic.by",
                    Body : message,
                        Attachments : [
                            {   
                                name : this.fileName,
                                data: this.dataUri
                            }
                        ]
                }).then( res => {
                    this.modalText = 'Ваша заявка отправлена'
                    this.modal = true;
                    setInterval(() => {
                        this.modal = false;
                    }, 8000);
                }, err => {
                    this.modalText = 'Произошла ошибка, попробуйте позже'
                    this.modal = true;
                    setInterval(() => {
                        this.modal = false;
                    }, 8000);
                });
            }
            
        }
    }
});