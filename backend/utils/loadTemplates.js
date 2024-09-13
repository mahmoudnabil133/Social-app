const fs = require('fs');
const path = require('path');

const loadTemplates = (templateName, replacement)=>{
    const templatePath = path.join(__dirname, `../templates/emails/${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf-8');
    for( let key in replacement){
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), replacement[key]);
    }
    return template;
};
module.exports = loadTemplates;