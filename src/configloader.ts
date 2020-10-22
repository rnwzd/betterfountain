var fs = require('fs');
import * as vscode from 'vscode';
import * as path from 'path';

export class FountainConfig{
    number_scenes_on_save: boolean;
    embolden_scene_headers:boolean;
    show_page_numbers:boolean;
    split_dialogue:boolean;
    print_title_page:boolean;
    print_profile:string;
    double_space_between_scenes:boolean;
    print_sections:boolean;
    print_synopsis:boolean;
    print_actions:boolean;
    print_headers:boolean;
    print_dialogues:boolean;
    number_sections:boolean;
    use_dual_dialogue:boolean;
    print_notes:boolean;
    print_header:string;
    print_footer:string;
    print_watermark:string;
    scenes_numbers:string;
    each_scene_on_new_page:boolean;
    merge_empty_lines:boolean;
    print_dialogue_numbers:boolean;
    create_bookmarks:boolean;
    invisible_section_bookmarks:boolean;
    synchronized_markup_and_preview:boolean;
    preview_theme:string;
    preview_texture:boolean;
    text_more:string;
    text_contd:string;
}

export type FountainUIPersistence = {
    [key: string]: any,
    outline_visibleSynopses:boolean,
    outline_visibleNotes:boolean
}
export let uiPersistence:FountainUIPersistence = {
    outline_visibleSynopses: true,
    outline_visibleNotes: true
}

function checkFileExistsSync(filepath:string){
    let flag = true;
    try{
      fs.accessSync(filepath, fs.constants.F_OK);
    }catch(e){
      flag = false;
    }
    return flag;
  }

let uiPersistenceFile = path.join(__dirname, "uipersistence.json");

export var initFountainUIPersistence = function(){
    if(checkFileExistsSync(uiPersistenceFile)){
        let savedUiPersistenceStr = fs.readFileSync(uiPersistenceFile);
        if(savedUiPersistenceStr == undefined){
            return;
        }
        let savedUiPersistence = JSON.parse(savedUiPersistenceStr);
        Object.keys(uiPersistence).forEach((v)=>{
            if(Object.keys(savedUiPersistence).includes(v)){
                uiPersistence[v] = savedUiPersistence[v];
            }
        });
        console.log("Loaded FountainUIPersistence from " + uiPersistenceFile);
    }
    else{
        console.log("Failed to load FountainUIPersistence from " + uiPersistenceFile);
    }

}

export var changeFountainUIPersistence = function(key:"outline_visibleSynopses"|"outline_visibleNotes", value:any){
    if(Object.keys(uiPersistence).indexOf(key)>=0){
        uiPersistence[key] = value;
        fs.writeFileSync(uiPersistenceFile, JSON.stringify(uiPersistence));
    }
    else{
        throw new Error("The requested fountainUIPersistence key does not exist!");
    }
}

export var getFountainConfig = function(docuri:vscode.Uri):FountainConfig{
    if(!docuri && vscode.window.activeTextEditor != undefined) 
        docuri = vscode.window.activeTextEditor.document.uri;
    var pdfConfig = vscode.workspace.getConfiguration("fountain.pdf", docuri);
    var generalConfig = vscode.workspace.getConfiguration("fountain.general", docuri);
    return {
        number_scenes_on_save: generalConfig.numberScenesOnSave,
        embolden_scene_headers: pdfConfig.emboldenSceneHeaders,
        show_page_numbers: pdfConfig.showPageNumbers,
        split_dialogue: pdfConfig.splitDialog,
        print_title_page: pdfConfig.printTitlePage,
        print_profile: pdfConfig.printProfile,
        double_space_between_scenes: pdfConfig.doubleSpaceBetweenScenes,
        print_sections: pdfConfig.printSections,
        print_synopsis: pdfConfig.printSynopsis,
        print_actions: pdfConfig.printActions,
        print_headers: pdfConfig.printHeaders,
        print_dialogues: pdfConfig.printDialogues,
        number_sections: pdfConfig.numberSections,
        use_dual_dialogue: pdfConfig.useDualDialogue,
        print_notes: pdfConfig.printNotes,
        print_header: pdfConfig.pageHeader,
        print_footer: pdfConfig.pageFooter,
        print_watermark: pdfConfig.watermark,
        scenes_numbers: pdfConfig.sceneNumbers,
        each_scene_on_new_page: pdfConfig.eachSceneOnNewPage,
        merge_empty_lines: pdfConfig.mergeEmptyLines,
        print_dialogue_numbers: pdfConfig.showDialogueNumbers,
        create_bookmarks: pdfConfig.createBookmarks,
        invisible_section_bookmarks: pdfConfig.invisibleSectionBookmarks,
        text_more: pdfConfig.textMORE,
        text_contd: pdfConfig.textCONTD,
        synchronized_markup_and_preview: generalConfig.synchronizedMarkupAndPreview,
        preview_theme: generalConfig.previewTheme,
        preview_texture: generalConfig.previewTexture
    }
}