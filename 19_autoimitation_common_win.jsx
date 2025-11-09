/*
    Desighned by T2_Enkou（全く初心者です）

    umfだけではなく、他の班とか、社内ヘルプの時もスムーズに使えるように。
    This script not only for umf, but also for other groups and for smooth use of the help.
    2023/02/12 
*/

/////////////////////////////////////////////////////////////////////////
//
// Automation v3
// ©2023 T2_Enkou
// Author: T2_Enkou
//
// Memo
//      - 2000行以上のスクリプトは初めてですので、若干コントロールが難しい？コントロールが失ってしまった感じがします。
//      - もっと勉強しないと。(もちろん、撮影もそうです！)
//      -
// Version History
// 0.1 initial programming - 12/2022
// 0.5 Added UI, blessed for umf_Automation - 01/2023
// 1.01 Test Tittle - 02/2023
//      - 「ウマ娘３」使えます
//      - 「廃墟」使えます
//      - 「シャーマンキング」使えます
//      - 「BuddyDaddies」使えます
//      - 「umf」使えます
//      - 「くまクマ熊ベアー」使えます
//      - 「PDO」使えます
//      -
//      - 「劇場版ちょっとわかりません、ラジャーは使えません、コンポ構成全然違うので。
//      -
// Attention!!
//      - レンダーキューの「レンダリング設定」のテンプレの名前と「出力モジュール」のテンプレの名前は絶対一様しないでください。マシンがこんがらがるので！？
//      - レンダーキューアイテムで、必ず一番目のアイテムはstillとして、二番目のアイテムはmovとcheck_movで設定してください！
//      -
// 1.02 Massive update - 02/2023
//      - 素材インプットの機能を試しに追加しました、関数automation()と関数gouseiImport()です。
//      - 作品設定UIで素材導入する時「素材フォルダー」と「素材コンポフォルダー」二つの選択追加しました。デフォルト設定は「03_paint」です。
//      -
// 1.03 - Update - 03/2023
//      - 作品設定ウィンドウで新たに「haveTakeNumber?」のチェックボックスを追加しました。
//      - 例：「薬屋のひとりごと」の場合,　AEP name ：「KHT00_00_000_000_P1」　チェックボックス「haveTakeNumber?」をチェックしない。　　　カットナンバーの後ろテイクナンバーないので
//      - 例：「umf」の場合,　　　　　　　 AEP name ：「umf_00_000_1_000_1」　 チェックボックス「haveTakeNumber?」をチェックします。　　　カットナンバーの後ろテイクナンバーあるので
//      - 作品設定ウィンドウでバージョンと版権のテキスト追加しました。
//      -
// 1.04 - Update - 03/2023
//      - 廃墟でヘルプの時、BGは複製しませんのと、BG中にLO追加しませんのことをわかりましたので、ローカル設定ウィンドウで「"BG複製する、BGの中LO追加する"」のチェックボックスを追加しました。
//      - 例：チェックする時：umfのように、BGを複製し、名前は"bg1"にします、"bg1"の中にLO追加し、LOのモードは「乗算」。
//      - 例：チェックしない時：廃墟のように、元々のBG直接gouseiコンポに追加し、gouseiコンポ中のLOのモードを「乗算」にする。
//      - ローカル設定ファイルは一つではなく、各作品によって、別々に設定いたします。
//      - セルフォルダーの中に「Cfinfo.cs6」があれば、消してから素材読み込みます。
//      -
// 1.05 - Fixes - 03/2023
//      - 作品設定とローカル設定のファイルはtextからjsonに変更しました、これでもっと安全、安定でしょう。
//      - レンダーキューアイテム、一番目は必ずstill,二番目必ずmovとcheck_movを修正しました。これからはファイル名の拡張子（jpg,mov）で判断します。これで順番どっちでもいいです。
//      - 作品設定ウィンドウでドロップリストのアクティブは各チェックボックス（onLineMovie,offLineMovie,still）でコントロールすることにしました。
//      - 作品設定ウィンドウで「作品名略称」以外のedittextは、入力する時、stringの前後スペースだけ自動的に消します。（str真ん中のスペース消しません！）これで万が一ユーザー間違って入力されても問題なし。
//      -
// 1.06 - Update - 03/2023
//      - 「薬屋のひとりごと」ヘルプの時、各タイトルAnti違うことがあるのがわかりました、ローカル設定でantiチェックボックスの後ろ、アンチ名入力するedittext追加しました（拡張子までお願い致します。）
//      - 例：↑base_AEpresetフォルダーは読み込み専用なので、最初は権利ないので、できませんでしたが。何故かまたアンチプリセットを適応可能になりました。試験運用(一定期間継続)
//      -
// 1.07 - Update - 04/2023
//      -作品設定ウィンドウで「144コマ刻みますか」のチェックボックスを追加しました。
//      - 例：↑チェックする時は144フレームで切ります（丁度144と288コマの場合もっとプラス144,288コマ）、チェックしない時はデフォルトの100コマで切ります。
//      -ヘルプボタンの内容を変わりました、アラートだけではなく、マニュアルと更新のところを表示する。T2公式ホームページボタン追加しました。
//      -
// 1.08 - Fixes - 04/2023
//      -cfinfoだけではなくcatalogあれば一緒に消してから、セルを読み込みます。

////////////////////////////////////////////////////////////////////////

(function (enkou) {
    //top
    var AEP_NAME = app.project.file.name.split(".")[0].split("_");
    var AEP_PATH = app.project.file.path;

    //--
    //myMainWindow
    var myMainWindow = (function (enkou) {
        // MYWINDOW
        // ========
        var myMainWindow = new Window("palette", "T2 Atuomation");
        myMainWindow.alignChildren = ["center", "top"];
        myMainWindow.spacing = 10;
        myMainWindow.margins = 16;

        // PANEL1
        // ======
        var panel1 = myMainWindow.add("panel", undefined, undefined, { name: "panel1" });
        panel1.preferredSize.width = 300;
        panel1.orientation = "row";
        panel1.alignChildren = ["fill", "top"];
        panel1.spacing = 10;
        panel1.margins = 10;

        // GROUP1
        // ======
        var group1 = panel1.add("group", undefined, { name: "group1" });
        group1.orientation = "row";
        group1.alignChildren = ["left", "top"];
        group1.spacing = 10;
        group1.margins = 0;

        // GROUP2
        // ======
        var group2 = group1.add("group", undefined, { name: "group2" });
        group2.orientation = "column";
        group2.alignChildren = ["left", "center"];
        group2.spacing = 10;
        group2.margins = 0;

        var KY_TXT = group2.add("statictext", undefined, "兼用カット", { name: "statictext1" });

        var KY_CutNumber = group2.add("edittext", undefined, "1", { name: "edittext1" });
        KY_CutNumber.preferredSize.width = 60;
        KY_CutNumber.preferredSize.height = 35;

        // GROUP1
        // ======
        var T_Check = group1.add("checkbox", undefined, "タイミング", { name: "checkbox1" });

        // PANEL1
        // ======
        var Tittle_Btn = panel1.add("button", undefined, "作品設定", { name: "Tittle_Btn" });
        Tittle_Btn.alignment = ["right", "top"];
        Tittle_Btn.preferredSize.width = 70;
        Tittle_Btn.preferredSize.height = 20;

        var Local_Btn = panel1.add("button", undefined, "Local", { name: "Local_Btn" });
        Local_Btn.alignment = ["right", "top"];
        Local_Btn.preferredSize.width = 30;
        Local_Btn.preferredSize.height = 20;

        var HELP_Btn = panel1.add("button", undefined, "?", { name: "button2" });
        HELP_Btn.alignment = ["right", "top"];
        HELP_Btn.preferredSize.width = 20;
        HELP_Btn.preferredSize.height = 20;

        // PANEL2
        // ======
        var panel2 = myMainWindow.add("panel", undefined, undefined, { name: "panel2" });
        panel2.preferredSize.width = 300;
        panel2.orientation = "column";
        panel2.alignChildren = ["center", "top"];
        panel2.spacing = 10;
        panel2.margins = 12;

        // GROUP3
        // ======
        var group3 = panel2.add("group", undefined, { name: "group3" });
        group3.orientation = "row";
        group3.alignChildren = ["left", "center"];
        group3.spacing = 180;
        group3.margins = 0;

        var Second_TXT = group3.add("statictext", undefined, "秒数", { name: "statictext2" });

        var Koma_TXT = group3.add("statictext", undefined, "コマ", { name: "statictext3" });

        // GROUP4
        // ======
        var group4 = panel2.add("group", undefined, { name: "group4" });
        group4.orientation = "row";
        group4.alignChildren = ["left", "center"];
        group4.spacing = 120;
        group4.margins = 0;

        var Second_INDEX = group4.add('edittext {properties: {name: "edittext4"}}');
        Second_INDEX.preferredSize.width = 80;
        Second_INDEX.preferredSize.height = 35;

        var Koma_INDEX = group4.add('edittext {properties: {name: "edittext5"}}');
        Koma_INDEX.preferredSize.width = 80;
        Koma_INDEX.preferredSize.height = 35;

        // PANEL3
        // ======
        var panel3 = myMainWindow.add("panel", undefined, undefined, { name: "panel3" });
        panel3.preferredSize.width = 300;
        panel3.orientation = "column";
        panel3.alignChildren = ["left", "top"];
        panel3.spacing = 10;
        panel3.margins = 10;

        var Go_Btn = panel3.add("button", undefined, "実行", { name: "button3" });
        Go_Btn.preferredSize.width = 80;
        Go_Btn.preferredSize.height = 35;
        Go_Btn.alignment = ["right", "top"];

        //--
        //keyEvent
        function keyEvent(e) {
            if (e.keyIdentifier == "Shift") {
                if (T_Check.value == false) {
                    T_Check.value = true;
                } else {
                    T_Check.value = false;
                }
            }
        }

        //Status function
        //@@
        KY_CutNumber.active = true;
        myMainWindow.layout.layout(true);
        myMainWindow.layout.resize();
        myMainWindow.addEventListener("keydown", keyEvent);
        myMainWindow.center();
        myMainWindow.show();
        myMainWindow.defaultElement = Go_Btn;

        return myMainWindow;
    })(this);

    //myMainWindow variable declaration
    //@@
    var mainPanel = myMainWindow.panel2;
    var KY_CutNumber_EDT = myMainWindow.panel1.group1.group2.edittext1;
    var Second_TXT = mainPanel.group4.edittext4;
    var Koma_TXT = mainPanel.group4.edittext5;
    var HELP_Btn = myMainWindow.panel1.button2;
    var GO_Btn = myMainWindow.panel3.button3;
    GO_Btn.enabled = false;
    var T_Check = myMainWindow.panel1.group1.checkbox1;
    var Tittle_Btn = myMainWindow.panel1.Tittle_Btn;
    var Local_Btn = myMainWindow.panel1.Local_Btn;

    //--
    //mySettingWindow
    var mySettingWindow = (function (enkou) {
        // MYSETTINGWINDOW
        // ===============
        var mySettingWindow = new Window("palette", "作品設定");
        mySettingWindow.orientation = "row";
        mySettingWindow.alignChildren = ["center", "top"];
        mySettingWindow.spacing = 0;
        mySettingWindow.margins = [40, 25, 40, 25];

        // LEFT_GROUP
        // ==========
        var left_Group = mySettingWindow.add("group", undefined, { name: "left_Group" });
        left_Group.orientation = "column";
        left_Group.alignChildren = ["left", "center"];
        left_Group.spacing = 6;
        left_Group.margins = 0;

        var Tittle_Name_TXT = left_Group.add("statictext", undefined, "作品名略称", { name: "Tittle_Name_TXT" });

        var Tittle_Name = left_Group.add('edittext {properties: {name: "Tittle_Name"}}');
        //Tittle_Name.text = Tittle;
        Tittle_Name.preferredSize.width = 60;
        Tittle_Name.preferredSize.height = 30;

        var Render_Folder_Name_TXT = left_Group.add("statictext", undefined, "レンダーフォルダー名", { name: "Render_Folder_Name_TXT" });

        var Render_Folder_Name = left_Group.add('edittext {properties: {name: "Render_Folder_Name"}}');
        Render_Folder_Name.preferredSize.width = 120;
        Render_Folder_Name.preferredSize.height = 30;

        var Sozai_Folder_Name_TXT = left_Group.add("statictext", undefined, "素材フォルダー名", { name: "Sozai_Folder_Name_TXT" });

        var Sozai_Folder_Name = left_Group.add('edittext {properties: {name: "Sozai_Folder_Name"}}');
        Sozai_Folder_Name.text = "03_paint";
        Sozai_Folder_Name.preferredSize.width = 120;
        Sozai_Folder_Name.preferredSize.height = 30;

        var BOLD_KOMA_TXT = left_Group.add("statictext", undefined, "ボールドコマ数", { name: "BOLD_KOMA_TXT" });

        var BOLD_KOMA = left_Group.add('edittext {properties: {name: "BOLD_KOMA"}}');
        BOLD_KOMA.text = "8";
        BOLD_KOMA.preferredSize.width = 50;
        BOLD_KOMA.preferredSize.height = 30;

        var Render_WHAT_TXT = left_Group.add("statictext", undefined, "※レンダリングで何を書き出すか", { name: "Render_WHAT_TXT" });

        var onLineMovie_Check = left_Group.add("checkbox", undefined, "オンラインムービー", { name: "onLineMovie_Check" });

        var Still_Check = left_Group.add("checkbox", undefined, "Still", { name: "Still_Check" });

        var noTakeNumer_Check = left_Group.add("checkbox", undefined, "haveTakeNumber?", { name: "noTakeNumer_Check" });

        var Render_Template_Name_TXT = left_Group.add("statictext", undefined, "※使用するレンダリング設定のテンプレ名", { name: "Render_Template_Name_TXT" });

        var Movie_Template_Name_TXT = left_Group.add("statictext", undefined, "ムービー", { name: "Movie_Template_Name_TXT" });

        var Movie_Template_Name_DropList = left_Group.add("dropdownlist", undefined, findRenderingSetting(), { name: "Movie_Template_Name_DropList" });
        Movie_Template_Name_DropList.preferredSize.width = 140;

        var OutputModule_Template_Name_TXT = left_Group.add("statictext", undefined, "※使用する出力モジュールのテンプレ名", { name: "OutputModule_Template_Name_TXT" });

        var onLine_OutputModule_Template_Name_TXT = left_Group.add("statictext", undefined, "オンライン", { name: "onLine_OutputModule_Template_Name_TXT" });

        var onLine_OutputModule_Template_Name_DropList = left_Group.add("dropdownlist", undefined, findOutputModuleSetting(), { name: "onLine_OutputModule_Template_Name_DropList" });
        //onLine_OutputModule_Template_Name_DropList.selection = 0;
        onLine_OutputModule_Template_Name_DropList.preferredSize.width = 140;

        var Still_OutputModule_Template_Name_TXT = left_Group.add("statictext", undefined, "Still", { name: "Still_OutputModule_Template_Name_TXT" });

        var Still_OutputModule_Template_Name_DropList = left_Group.add("dropdownlist", undefined, findOutputModuleSetting(), { name: "Still_OutputModule_Template_Name_DropList" });
        //Still_OutputModule_Template_Name_DropList.selection = 0;
        Still_OutputModule_Template_Name_DropList.preferredSize.width = 140;

        var OutputName_Setting_TXT = left_Group.add("statictext", undefined, "※出力名の設定", { name: "OutputName_Setting_TXT" });

        var onLine_OutputName_Setting_TXT = left_Group.add("statictext", undefined, "オンライン", { name: "onLine_OutputName_Setting_TXT" });

        var onLine_OutputName_Setting_DropList = left_Group.add("dropdownlist", undefined, findOutputName(), { name: "onLine_OutputName_Setting_DropList" });
        //onLine_OutputName_Setting_DropList.selection = 0;
        onLine_OutputName_Setting_DropList.preferredSize.width = 140;

        var Still_OutputName_Setting_TXT = left_Group.add("statictext", undefined, "Still", { name: "Still_OutputName_Setting_TXT" });

        var Still_OutputName_Setting_DropList = left_Group.add("dropdownlist", undefined, findOutputName(), { name: "Still_OutputName_Setting_DropList" });
        //Still_OutputName_Setting_DropList.selection = 0;
        Still_OutputName_Setting_DropList.preferredSize.width = 140;

        // Version_GROUP
        // ===========
        var version_Group = left_Group.add("group", undefined, { name: "version_Group" });
        version_Group.orientation = "column";
        version_Group.alignChildren = ["left", "center"];
        version_Group.spacing = 6;
        version_Group.margins = 0;

        var Empty_Statictext100 = version_Group.add("statictext", undefined, undefined, { name: "Empty_Statictext100" });
        Empty_Statictext100.preferredSize.height = 40;

        var Inc_TXT = version_Group.add("statictext", undefined, "© T2 studio Inc.", { name: "Inc_TXT" });

        var Version_TXT = version_Group.add("statictext", undefined, undefined, { name: "Version_TXT" });

        //さてさて、これは誰か見つけられるでしょう(笑)
        // var createUserName_TXT = version_Group.add("statictext", undefined, "© 2023 T2 Enkou", { name: "createUserName_TXT" });

        // RIGHT_GROUP
        // ===========
        var right_Group = mySettingWindow.add("group", undefined, { name: "right_Group" });
        right_Group.orientation = "column";
        right_Group.alignChildren = ["left", "center"];
        right_Group.spacing = 6;
        right_Group.margins = 0;

        var TimingNotation_TXT = right_Group.add("statictext", undefined, "タイミング表記(T、t1、c1...など)", { name: "TimingNotation_TXT" });

        var TimingNotation = right_Group.add('edittext {properties: {name: "TimingNotation"}}');
        //TimingNotation.text = "T";
        TimingNotation.preferredSize.width = 50;
        TimingNotation.preferredSize.height = 30;

        var stageComp_Folder_Name_TXT = right_Group.add("statictext", undefined, "stageCompフォルダー名", { name: "stageComp_Folder_Name_TXT" });

        var stageComp_Folder_Name = right_Group.add('edittext {properties: {name: "stageComp_Folder_Name"}}');
        //stageComp_Folder_Name.text = "1_comp";
        stageComp_Folder_Name.preferredSize.width = 120;
        stageComp_Folder_Name.preferredSize.height = 30;

        var sozaiComp_Folder_Name_TXT = right_Group.add("statictext", undefined, "素材コンポフォルダー名", { name: "sozaiComp_Folder_Name_TXT" });

        var sozaiComp_Folder_Name = right_Group.add('edittext {properties: {name: "sozaiComp_Folder_Name"}}');
        sozaiComp_Folder_Name.text = "03_paint";
        sozaiComp_Folder_Name.preferredSize.width = 120;
        sozaiComp_Folder_Name.preferredSize.height = 30;

        var Framerate_TXT = right_Group.add("statictext", undefined, "フレームレート", { name: "Framerate_TXT" });

        var Framerate = right_Group.add('edittext {properties: {name: "Framerate"}}');
        Framerate.text = "24";
        Framerate.preferredSize.width = 50;
        Framerate.preferredSize.height = 30;

        var Empty_Statictext1 = right_Group.add("statictext", undefined, undefined, { name: "Empty_Statictext1" });
        Empty_Statictext1.preferredSize.height = 14;

        var offLineMovie_Chcek = right_Group.add("checkbox", undefined, "オフラインムービー", { name: "offLineMovie_Chcek" });

        var tittleAndEpisode_Chcek = right_Group.add("checkbox", undefined, "「_」あるかどうか", { name: "tittleAndEpisode_Chcek" });

        var isSheetFrameSlash_Check = right_Group.add("checkbox", undefined, "144コマ刻みますか", { name: "isSheetFrameSlash_Check" });

        var Empty_Statictext2 = right_Group.add("statictext", undefined, undefined, { name: "Empty_Statictext2" });
        Empty_Statictext2.preferredSize.height = 16;

        var Still_Template_Name_TXT = right_Group.add("statictext", undefined, "Still", { name: "Still_Template_Name_TXT" });

        var Still_Template_Name_DropList = right_Group.add("dropdownlist", undefined, findRenderingSetting(), { name: "Still_Template_Name_DropList" });
        //Still_Template_Name_DropList.selection = 0;
        Still_Template_Name_DropList.preferredSize.width = 140;

        var Empty_Statictext3 = right_Group.add("statictext", undefined, undefined, { name: "Empty_Statictext3" });
        Empty_Statictext3.preferredSize.height = 14;

        var offLine_OutputModule_Template_Name_TXT = right_Group.add("statictext", undefined, "オフライン", { name: "offLine_OutputModule_Template_Name_TXT" });

        var offLine_OutputModule_Template_Name_DropList = right_Group.add("dropdownlist", undefined, findOutputModuleSetting(), { name: "offLine_OutputModule_Template_Name_DropList" });
        //offLine_OutputModule_Template_Name_DropList.selection = 0;
        offLine_OutputModule_Template_Name_DropList.preferredSize.width = 140;

        var Empty_Statictext4 = right_Group.add("statictext", undefined, undefined, { name: "Empty_Statictext4" });
        Empty_Statictext4.preferredSize.height = 65;

        var offLine_OutputName_Setting_TXT = right_Group.add("statictext", undefined, "オフライン", { name: "offLine_OutputName_Setting_TXT" });

        var offLine_OutputName_Setting_DropList = right_Group.add("dropdownlist", undefined, findOutputName(), { name: "offLine_OutputName_Setting_DropList" });
        //offLine_OutputName_Setting_DropList.selection = 0;
        offLine_OutputName_Setting_DropList.preferredSize.width = 140;

        var Empty_Statictext5 = right_Group.add("statictext", undefined, undefined, { name: "Empty_Statictext5" });
        Empty_Statictext5.preferredSize.height = 60;

        var writeOut_Btn = right_Group.add("button", undefined, "書き出し", { name: "writeOut_Btn" });
        writeOut_Btn.preferredSize.width = 90;
        writeOut_Btn.preferredSize.height = 32;
        writeOut_Btn.alignment = ["right", "center"];

        mySettingWindow.defaultElement = writeOut_Btn;

        return mySettingWindow;
    })(this);

    //ドロップリストのアクティブはチェックボックスでコントロール
    function enableDropDownLists(dropDownLists, checkBox) {
        checkBox.onClick = function () {
            for (var i = 0; i < dropDownLists.length; i++) {
                dropDownLists[i].enabled = checkBox.value;
            }
        };
    }

    //LIT
    function enableDropDownListsLit(dropDownLists, checkBox) {
        for (var i = 0; i < dropDownLists.length; i++) {
            dropDownLists[i].enabled = checkBox;
        }
    }

    //mySettingWindow variable declaration
    //@@

    //定番
    var Tittle_Name = mySettingWindow.left_Group.Tittle_Name; //作品名略称value
    var TimingNotation = mySettingWindow.right_Group.TimingNotation; //タイミング表記(T、t1、c1...など)value

    var Render_Folder_Name = mySettingWindow.left_Group.Render_Folder_Name; //レンダーフォルダー名value
    var Sozai_Folder_Name = mySettingWindow.left_Group.Sozai_Folder_Name; //素材フォルダ名value
    var stageComp_Folder_Name = mySettingWindow.right_Group.stageComp_Folder_Name; //stageCompフォルダー名value
    var sozaiComp_Folder_Name = mySettingWindow.right_Group.sozaiComp_Folder_Name; //素材compフォルダー名value

    var BOLD_KOMA = mySettingWindow.left_Group.BOLD_KOMA; //ボールドコマ数value
    var Framerate = mySettingWindow.right_Group.Framerate; //フレームレートvalue

    //レンダリングで何を書き出すか
    var onLineMovie_Check = mySettingWindow.left_Group.onLineMovie_Check; //オンラインムービーチェックボックスvalue
    var offLineMovie_Chcek = mySettingWindow.right_Group.offLineMovie_Chcek; //オフラインムービーチェックボックスvalue
    var Still_Check = mySettingWindow.left_Group.Still_Check; //スチールチェックボックスvalue
    var noTakeNumer_Check = mySettingWindow.left_Group.noTakeNumer_Check; //
    var tittleAndEpisode_Chcek = mySettingWindow.right_Group.tittleAndEpisode_Chcek; //フォルダー名前の作品名と話数の間に「_」あるかどうかvalue
    var isSheetFrameSlash_Check = mySettingWindow.right_Group.isSheetFrameSlash_Check;

    //使用するレンダリング設定のテンプレ名
    var Movie_Template_Name_DropList = mySettingWindow.left_Group.Movie_Template_Name_DropList; //レンダリング設定のムービーテンプレ名value
    Movie_Template_Name_DropList.enabled = false;

    var Still_Template_Name_DropList = mySettingWindow.right_Group.Still_Template_Name_DropList; //レンダリング設定のスチールテンプレ名value
    Still_Template_Name_DropList.enabled = false;

    //使用する出力モジュールのテンプレ名
    var onLine_OutputModule_Template_Name_DropList = mySettingWindow.left_Group.onLine_OutputModule_Template_Name_DropList; //オンライン出力モジュールのテンプレ名DropList value
    onLine_OutputModule_Template_Name_DropList.enabled = false;

    var offLine_OutputModule_Template_Name_DropList = mySettingWindow.right_Group.offLine_OutputModule_Template_Name_DropList; //オフライン出力モジュールのテンプレ名DropList value
    offLine_OutputModule_Template_Name_DropList.enabled = false;

    var Still_OutputModule_Template_Name_DropList = mySettingWindow.left_Group.Still_OutputModule_Template_Name_DropList; //スチール出力モジュールのテンプレ名DropList value
    Still_OutputModule_Template_Name_DropList.enabled = false;

    //出力名の設定
    var onLine_OutputName_Setting_DropList = mySettingWindow.left_Group.onLine_OutputName_Setting_DropList; //オンライン出力名の設定DropList value
    onLine_OutputName_Setting_DropList.enabled = false;

    var offLine_OutputName_Setting_DropList = mySettingWindow.right_Group.offLine_OutputName_Setting_DropList; //オフライン出力名の設定DropList value
    offLine_OutputName_Setting_DropList.enabled = false;

    var Still_OutputName_Setting_DropList = mySettingWindow.left_Group.Still_OutputName_Setting_DropList; //スチール出力名の設定DropList value
    Still_OutputName_Setting_DropList.enabled = false;

    //書き出しボタン
    var writeOut_Btn = mySettingWindow.right_Group.writeOut_Btn;

    //version
    var Version_TXT = mySettingWindow.left_Group.version_Group.Version_TXT;
    Version_TXT.text = "Rev.1.08 2023/04/10";

    //ドロップリストのアクティブ
    enableDropDownLists([Movie_Template_Name_DropList, onLine_OutputModule_Template_Name_DropList, onLine_OutputName_Setting_DropList], onLineMovie_Check);
    enableDropDownLists([offLine_OutputModule_Template_Name_DropList, offLine_OutputName_Setting_DropList], offLineMovie_Chcek);
    enableDropDownLists([Still_Template_Name_DropList, Still_OutputModule_Template_Name_DropList, Still_OutputName_Setting_DropList], Still_Check);

    //--
    //myLocalWindow
    var myLocalWindow = (function (enkou) {
        // PALETTE
        // =======
        var myLocalWindow = new Window("palette", "myLocalWindow");
        myLocalWindow.orientation = "row";
        myLocalWindow.alignChildren = ["center", "top"];
        myLocalWindow.spacing = 20;
        myLocalWindow.margins = 25;

        // LEFT_GROUP
        // ==========
        var Left_Group = myLocalWindow.add("group", undefined, { name: "Left_Group" });
        Left_Group.orientation = "column";
        Left_Group.alignChildren = ["left", "center"];
        Left_Group.spacing = 10;
        Left_Group.margins = 0;

        var BG_Label_TXT = Left_Group.add("statictext", undefined, "※BGレイヤーのラベルカラー", { name: "BG_Label_TXT" });

        var Paint_Label_TXT = Left_Group.add("statictext", undefined, "※paintレイヤーのラベルカラー", { name: "Paint_Label_TXT" });

        var Lo_Label_TXT = Left_Group.add("statictext", undefined, "※LOレイヤーのラベルカラー", { name: "Lo_Label_TXT" });

        var Anti_Check = Left_Group.add("checkbox", undefined, "anti-aliasing処理", { name: "Anti_Check" });

        var BG_Size_Check = Left_Group.add("checkbox", undefined, "BGをLOサイズに合わせる", { name: "BG_Size_Check" });

        var Lo_Position_TXT = Left_Group.add("statictext", undefined, "※LOのレイヤーの位置", { name: "Lo_Position_TXT" });

        var Ue_R_Btn = Left_Group.add("radiobutton", undefined, "上", { name: "Ue_R_Btn" });

        var Shita_R_Btn = Left_Group.add("radiobutton", undefined, "下", { name: "Shita_R_Btn" });

        var Lo_Multiply_Check = Left_Group.add("checkbox", undefined, "BG中のLOレイヤーを乗算にする", { name: "Lo_Multiply_Check" });

        var copy_BG_check = Left_Group.add("checkbox", undefined, "BG複製する、BGの中LO追加する", { name: "copy_BG_check" });

        // REIGHT_GROUP
        // ============
        var Reight_Group = myLocalWindow.add("group", undefined, { name: "Reight_Group" });
        Reight_Group.orientation = "column";
        Reight_Group.alignChildren = ["left", "center"];
        Reight_Group.spacing = 4;
        Reight_Group.margins = 0;

        var BG_Label_EDT = Reight_Group.add('edittext {properties: {name: "BG_Label_EDT"}}');
        BG_Label_EDT.preferredSize.width = 35;
        BG_Label_EDT.preferredSize.height = 20;

        var Paint_Label_EDT = Reight_Group.add('edittext {properties: {name: "Paint_Label_EDT"}}');
        Paint_Label_EDT.preferredSize.width = 35;
        Paint_Label_EDT.preferredSize.height = 20;

        var Lo_Label_EDT = Reight_Group.add('edittext {properties: {name: "Lo_Label_EDT"}}');
        Lo_Label_EDT.preferredSize.width = 35;
        Lo_Label_EDT.preferredSize.height = 20;

        var AntiName_EDT = Reight_Group.add('edittext {properties: {name: "AntiName_EDT"}}');
        AntiName_EDT.text = "anti_aliasing.ffx";
        AntiName_EDT.preferredSize.width = 80;
        AntiName_EDT.preferredSize.height = 20;

        var Empty_Statictext11 = Reight_Group.add("statictext", undefined, undefined, { name: "Empty_Statictext11" });
        Empty_Statictext11.preferredSize.height = 83;

        var Empty_Statictext12 = Reight_Group.add("statictext", undefined, undefined, { name: "Empty_Statictext12" });
        Empty_Statictext12.preferredSize.height = 115;

        var Local_writeOut_Btn = Reight_Group.add("button", undefined, "書き出し", { name: "Local_writeOut_Btn" });

        myLocalWindow.defaultElement = Local_writeOut_Btn;

        return myLocalWindow;
    })(this);

    //myLocalSettingWindow variable declaration
    //@@

    //leftGroup
    var Anti_Check = myLocalWindow.Left_Group.Anti_Check;
    var BG_Size_Check = myLocalWindow.Left_Group.BG_Size_Check;
    var Ue_R_Btn = myLocalWindow.Left_Group.Ue_R_Btn;
    var Shita_R_Btn = myLocalWindow.Left_Group.Shita_R_Btn;
    var Lo_Multiply_Check = myLocalWindow.Left_Group.Lo_Multiply_Check;
    var copy_BG_check = myLocalWindow.Left_Group.copy_BG_check;

    //reigtGroup
    var BG_Label_EDT = myLocalWindow.Reight_Group.BG_Label_EDT;
    var Paint_Label_EDT = myLocalWindow.Reight_Group.Paint_Label_EDT;
    var Lo_Label_EDT = myLocalWindow.Reight_Group.Lo_Label_EDT;
    var AntiName_EDT = myLocalWindow.Reight_Group.AntiName_EDT;

    //Btn
    var Local_writeOut_Btn = myLocalWindow.Reight_Group.Local_writeOut_Btn;

    //Get T2_pcFolder
    var Autoimitation_Folder = new Folder(app.settings.getSetting("T2studio", "AE Scripts Settings Folder", PREFType.PREF_Type_MACHINE_INDEPENDENT).replace(/t2/, "81909") + "setting_files/Autoimitation"); //設定ファイルの元のファルダーを作成するとこのパス
    var Works_Folder = new Folder(app.settings.getSetting("T2studio", "AE Scripts Settings Folder", PREFType.PREF_Type_MACHINE_INDEPENDENT).replace(/t2/, "81909") + "setting_files/Autoimitation/(works_e"); //作品設定ファイルが作成されるフォルダーのパスとフォルダー名
    var Local_Folder = new Folder(app.settings.getSetting("T2studio", "AE Scripts Settings Folder", PREFType.PREF_Type_MACHINE_INDEPENDENT).replace(/t2/, "81909") + "setting_files/Autoimitation/LocalSettings_e"); //ローカル設定フォルダー

    //Get Script Folder
    var SCRIPT_Autoimitation_Folder = File(app.settings.getSetting("T2studio", "AE Scripts Folder", PREFType.PREF_Type_MACHINE_INDEPENDENT).replace(/t2/, "81909") + "ScriptUI Panels/Automation");

    //作品設定とローカル設定ファイル
    var AEPNAME_JSON = new File(app.settings.getSetting("T2studio", "AE Scripts Settings Folder", PREFType.PREF_Type_MACHINE_INDEPENDENT).replace(/t2/, "81909") + "setting_files/Autoimitation/(works_e" + "/" + AEP_NAME[0] + "_e" + ".json"); //作品設定ファイルが作成されるフォルダーのパスとファイル名
    var LOCAL_JSON = new File(app.settings.getSetting("T2studio", "AE Scripts Settings Folder", PREFType.PREF_Type_MACHINE_INDEPENDENT).replace(/t2/, "81909") + "setting_files/Autoimitation/LocalSettings_e" + "/" + AEP_NAME[0] + "_LocalSettings_e.json"); //作品設定ファイルが作成されるフォルダーのパスとファイル名

    //Get preset
    var MYPRESET_PATH = new File(app.settings.getSetting("T2studio", "AE Scripts Settings Folder", PREFType.PREF_Type_MACHINE_INDEPENDENT).replace(/t2/, "81909") + "base_AEpreset" + "/" + AntiName_EDT.text);

    //severFile
    var SEVER_FILE = File("//T2m-nas01/06/_test/scripts/enkou/19_autoimitation_common_win.jsx");
    var LOCAL_FILE = File(app.settings.getSetting("T2studio", "AE Scripts Folder", PREFType.PREF_Type_MACHINE_INDEPENDENT).replace(/t2/, "81909") + "ScriptUI Panels/Automation/19_autoimitation_common_win.jsx");

    //作品設定とローカル設定jsonを読み込んで、パネルでvalue変更する
    readWorkJson(AEPNAME_JSON);
    readLocalJson(LOCAL_JSON);

    //check version
    //checkVersion(SEVER_FILE, LOCAL_FILE);

    //Get Material Folder
    var BG_FOLDER = Folder(AEP_PATH + "/bg");
    var PAINT_FOLDER = Folder(AEP_PATH + "/paint");

    //Global
    //@@
    var FRAMERATE = Number(Framerate.text);
    var BOLD = Number(BOLD_KOMA.text);
    var Second_TXT_INDEX = [];
    var Koma_TXT_INDEX = [];

    //Get Comp
    //@@
    var gousei_Comp = getProjectItem("01_gousei");
    var camera_Comp = getProjectItem("02_camera");
    var shake_Comp = getProjectItem("03_shake");
    var screenfx_Comp = getProjectItem("04_screenfx");

    //Get Layer
    //@@
    var frame_Layer = gousei_Comp.layer("frame");
    var gougei_Layer = camera_Comp.layer("01_gousei");
    var camera_Layer = shake_Comp.layer("02_camera");
    var shake_Layer = screenfx_Comp.layer("03_shake");

    //Get Folder
    //@@
    var COMP_Folder = getProjectFolder(stageComp_Folder_Name.text);
    var LO_Folder = getProjectFolder("01_lo_frame");
    var BG_Folder = getProjectFolder("02_bg");
    var PAINT_Folder = getProjectFolder("03_paint");
    var SOZAI_Folder = getProjectFolder(Sozai_Folder_Name.text);
    var SOZAI_COMP_Folder = getProjectFolder(sozaiComp_Folder_Name.text);
    var OTHER_Folder = getProjectFolder("07_other");
    var RENDER_Folder = getProjectFolder(Render_Folder_Name.text);

    //先に素材インプット（作品設定とローカル設定同時に存在する時は素材import，GO_Btnアクティブ）
    AEPNAME_JSON.exists && LOCAL_JSON.exists ? (automation(), (GO_Btn.enabled = true)) : null;

    //check System
    function isWindowsSystem() {
        return /Windows/.test($.os);
    }

    //イテレータ
    function forEach(array, callback) {
        for (var i = 0, l = array.length; i < l; i++) {
            callback(array[i], i, array);
        }
    }

    //フィルター
    function filter(arry, callback) {
        var result = [];

        forEach(arry, function (value, index, arry) {
            if (callback(value, index, arry)) {
                result.push(value);
            }
        });

        return result;
    }

    //各アイテム
    function forEachItems(item, callback) {
        for (var i = 1; i <= item.numItems; i++) {
            callback(item.items[i], i, item);
        }
    }

    //各レイヤー
    function forEachLayers(item, callback) {
        for (var i = 1; i <= item.numLayers; i++) {
            callback(item.layer(i), i, item);
        }
    }

    //ファイルの名前を貰う
    function getPlainFileName(fileName) {
        var result = "";

        fileName.replace(/(.*)\.[^\.]+$/, function (match, suffix) {
            result = suffix;
        });

        return result;
    }

    //ファイルの拡張子を貰う
    function getSuffix(fileName) {
        var result = "";

        fileName.replace(/[^\.]+\.([^\.]+)$/, function (match, suffix) {
            result = suffix;
        });

        return result;
    }

    //getProjectItem
    function getProjectItem(name) {
        for (var i = 1; i <= app.project.numItems; i++) {
            var targetComp = app.project.items[i];
            if (targetComp.name == name) return targetComp; //Comp name
        }
    }

    //getProjectFolder
    function getProjectFolder(name) {
        for (var i = 1; i <= app.project.numItems; i++) {
            var targetFolder = app.project.items[i];
            if (isAeFolderItem(targetFolder) && targetFolder.name == name) return targetFolder;
        }
    }

    //nullかどうかを断言する
    function isNull(value) {
        return value === null ? true : false;
    }

    //undefinedかどうかを断言する
    function isUndefined(value) {
        return value === undefined ? true : false;
    }

    //フォルダーかどうかを断言する
    function isFolder(value) {
        return value instanceof Folder;
    }

    //ファイルかどうかを断言する
    function isFile(value) {
        return value instanceof File;
    }

    //AEのフォルダーかどうかを断言する
    function isAeFolderItem(value) {
        return value instanceof FolderItem;
    }

    //AEのフッテージアイテムかどうかを断言する
    function isAeFootageItem(value) {
        return value instanceof FootageItem;
    }

    //AEのコンポかどうかを断言する
    function isAeCompItem(value) {
        return value instanceof CompItem;
    }

    //AVレイヤーかどうかを断言する
    function isAvLayer(value) {
        return value instanceof AVLayer;
    }

    //カメラレイヤーかどうかを断言する
    function isCameraLayer(value) {
        return value instanceof CameraLayer;
    }

    //AEP名のカットナンバー後ろ「テイクナンバー」ない場合の一番後ろのテイクナンバーを貰う
    function gettakeNumber(name) {
        return name[name.length - 1];
    }

    //URLを開きます
    function openURL(url) {
        if (isWindowsSystem()) {
            system.callSystem('cmd /c start microsoft-edge:"' + url + '"'); //microsoft-edgeで開きます
        } else {
            var cmd = 'open "' + url + '"';
            system.callSystem(cmd);
        }
    }

    //antiフォルダー読み込み専用のため、一旦アンチプリセットリストをデスクトップにコピーして、applyしてから消します（各タイトルanti違う場合）
    // function copyPresetApply(target, presetFile) {
    //     //Folder.desktop.absoluteURI 该文件夹的绝对路径的字符串表示形式
    //     var desktopPath = Folder.desktop.absoluteURI;
    //     // アンチプリセットをデスクトップにコピー
    //     var tempPresetFile = new File(desktopPath + "/" + AntiName_EDT.text);

    //     presetFile.copy(tempPresetFile); //デスクトップにコピー

    //     target.applyPreset(tempPresetFile);

    //     tempPresetFile.remove(); // コピーファイル消します
    // }

    //コンポ(renderComp)の名前を変更する
    function changeRenderCompName(newComps, newName) {
        for (var i = 0; i < newName.length; i++) {
            newComps[i].name = newName[i];
        }
    }

    //コンポを複製する
    function dupCompArry(comp, number) {
        var result = [];

        for (var i = 0; i < number; i++) {
            var dupComp = comp.duplicate();
            result.push(dupComp);
        }

        return result;
    }

    //コンポのデュレーションを変更する
    function changeRenderCompDuration(targetComp, newComps, newDurations, kyCuts, bold, frameRate) {
        //兼用カットなしの場合
        if (kyCuts === 1) {
            targetComp.duration = newDurations + bold / frameRate;
        } else {
            //兼用カットあるの場合
            for (var i = 0; i < newDurations.length; i++) {
                newComps[i].duration = newDurations[i] + bold / frameRate;
            }
        }
    }

    //プロジェクトファイル名からカットの名前を貰う
    function getCutNames(aepName, isCustomName, customName, kyCuts) {
        var result = [];
        var Tittle = aepName[0];
        var Episode = aepName[1];
        var cutNumber = 2;
        var takeNumber = 3;

        for (var i = 0; i < kyCuts; i++) {
            if (isCustomName) {
                //タイミングチェックの場合
                if (customName == "") {
                    //作品設定ウィンドウタイミング表記何も書かない場合
                    alert("作品設定のタイミング表記欄が空白です。");
                    result.push(Tittle + "_" + "00" + "_" + "000" + "_" + aepName[takeNumber]);
                } else {
                    //作品設定ウィンドウタイミング表記書く場合
                    result.push(Tittle + "_" + Episode + "_" + aepName[cutNumber] + "_" + customName);
                }
            } else {
                //本撮の場合
                result.push(Tittle + "_" + Episode + "_" + aepName[cutNumber] + "_" + aepName[takeNumber]);
            }

            cutNumber += 2; //cutNumber = cutNumber + 2 毎回プラス2
            takeNumber += 2; //同上
        }

        return result;
    }

    //AEP名のカットナンバー後ろ「テイクナンバー」ない場合
    function getCutNamesNoTakeNumber(aepName, isCustomName, customName, kyCuts) {
        var result = [];
        var Tittle = aepName[0];
        var Episode = aepName[1];
        var cutNumber = 2;
        var takeNumber = gettakeNumber(aepName);

        for (var i = 0; i < kyCuts; i++) {
            if (isCustomName) {
                if (customName == "") {
                    alert("作品設定のタイミング表記欄が空白です。");
                    result.push(Tittle + "_" + "00" + "_" + "000" + "_" + takeNumber);
                } else {
                    result.push(Tittle + "_" + Episode + "_" + aepName[cutNumber] + "_" + customName);
                }
            } else {
                result.push(Tittle + "_" + Episode + "_" + aepName[cutNumber] + "_" + takeNumber);
            }

            cutNumber += 1;
        }

        return result;
    }

    //"兼用"レイヤーのチェックボックス制御、もしくはスライダー制御を変更する
    function changeKyLayerEffectIndex(targetComp, dupComp) {
        //targetComp = motoComp = RENDER_Folder.item(1);

        for (var L = 0; L < dupComp.length; L++) {
            for (var j = 1; j <= dupComp[L].numLayers; j++) {
                if (dupComp[L].layer(j).name == "兼用カット") {
                    // prettier-ignore
                    dupComp[L].layer(j).effect(1).property(1).setValue(L + 2);
                } else if (dupComp[L].layer(j).name == "兼用") {
                    //兼用カットのチェックボックスがチェックしているのかどうかを判断する
                    if (targetComp.layer("兼用").effect(1).property(1).value == 1 && dupComp[L].layer("兼用").effect(1).property(1).value == 1) {
                        targetComp.layer("兼用").effect(1).property(1).setValue(0);
                        dupComp[L].layer("兼用").effect(1).property(1).setValue(0);
                    }
                }
            }
            //dupComps  openInViewer
            //dupComp[L].openInViewer();
        }
    }

    //一つ目のmain処理
    function sameAsDuplicate(targetComp, timeValue, nameValue) {
        var dupComps = dupCompArry(targetComp, timeValue.length - 1);
        //concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
        var numComps = [targetComp].concat(dupComps);
        //var 四个合成 = 三个合成.concat([targetComp]);
        // alert(timeValue);

        changeRenderCompName(numComps, nameValue);
        changeRenderCompDuration(targetComp, numComps, timeValue, Number(KY_CutNumber_EDT.text), BOLD, FRAMERATE);
        changeKyLayerEffectIndex(targetComp, dupComps);
    }

    //moveLayerToFolderByName
    function moveLayerToFolderByName(layerName, targetFolder) {
        //基本BG読み込んだのBGコンポ以外のBGフォルダーレイヤー

        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.items[i];

            if (item.name === layerName) {
                item.parentFolder = targetFolder;
                return true;
            }
        }

        return false;
    }

    //automation(素材インプット)
    function automation() {
        //LOがどうかを断言する
        function isLO(text) {
            return /lo|frame|fr/i.test(text);
        }

        //UnusefulName名前かどうかを断言する
        function isUnusefulName(name) {
            return /lo|pool|sheet|go|old|xxx|ts|genga|st|tmp|key|iro|dpi|ko|moto/i.test(name);
        }

        //ペイントファイルの名前が正しいかどうか断言する
        function isCommonNumber(fileName) {
            return /^([a-z]+)(_[a-z]+)?(_[a-z]+)?\d{4}$/i.test(fileName);
        }

        //jpg|png|tga|tifがどうかを断言する
        function isDefultLoName(text) {
            return /jpg|png|tga|tif/i.test(text);
        }

        //jpg|png|tga|tif|psdかどうかを断言する
        function isPicturesName(text) {
            return /jpg|png|tga|tif|psd/i.test(text);
        }

        //テキストかどうかを断言する
        function isText(text) {
            return /txt/i.test(text);
        }

        //Cfinfoファイルかどうかを断言する
        function isCfinfoCatalogFile(text) {
            return /cfinfo|catalog/i.test(text);
        }

        //ペイントデータの名前正しいかどうかを断言する(違う場合は多重組み)
        function isValidSequenceNumber(sequenceTgas) {
            for (var j = 0; j < sequenceTgas.length; j++) {
                var sourceName = getPlainFileName(sequenceTgas[j].displayName);

                if (!isCommonNumber(sourceName)) {
                    return false;
                }
            }

            return true;
        }

        //他のファイルあるかどうか判断アラート
        function checkOtherFiles(isValue, message) {
            if (isValue) {
                alert(message);
            }
        }

        //AEフォルダーを作成する
        function createProjectFolder(name) {
            return app.project.items.addFolder(name);
        }

        //ファイルをシーケンスとしてインプット
        function importAsSequence(file) {
            var sequenceFile = new ImportOptions(file);
            sequenceFile.sequence = true;
            return app.project.importFile(sequenceFile);
        }

        //ファイルArrayを各インプット(paintフォルダー中の各tgaファイル、セルデータ)
        function importSequenceSeparate(files, folder) {
            forEach(files, function (file) {
                if (isFile(file)) {
                    var importedFile = app.project.importFile(new ImportOptions(file));

                    importedFile.parentFolder = folder;
                    moveLayerToFolderByName(importedFile.name + " レイヤー", folder); //BG読み込んだやつ

                    return importedFile;
                }
            });
        }

        //同上、但し、多重組みの場合
        function importSequenceSeparatePlus(files, folder) {
            forEach(files, function (file) {
                if (isFile(file)) {
                    var importedFile = app.project.importFile(new ImportOptions(file));

                    importedFile.parentFolder = folder;

                    return importedFile;
                }
            });
        }

        //ペイントフォルダーを探す
        function findSozaiFolder(folder) {
            var result = null;

            forEach(folder, function (targetFolder) {
                if (isFolder(targetFolder)) {
                    result = targetFolder;
                }
            });

            return result;
        }

        //Cfinfoのファイルを消します
        function removeCfinfoFiles(folder) {
            forEach(folder, function (file) {
                if (file.exists && isFile(file)) {
                    if (isCfinfoCatalogFile(file) === true) {
                        file.remove();
                    }
                }
            });
        }

        app.beginUndoGroup("material_Import");

        //bgの読み込み
        function importAndMoveBG(Material_Folder, project_Folder) {
            var files = Material_Folder.getFiles(); //BGのフォルダー中のpsdファイル

            forEach(files, function (target_BG) {
                //psdファイル拡張子はjpg|png|tga|tif|psdの場合であれば
                if (isPicturesName(target_BG.displayName)) {
                    var Import_BG = new ImportOptions(target_BG);

                    //コンポジションとして導入
                    if (Import_BG.canImportAs(ImportAsType.COMP)) {
                        Import_BG.importAs = ImportAsType.COMP;
                    }

                    var imputProject_BGItem = app.project.importFile(Import_BG);

                    imputProject_BGItem.parentFolder = project_Folder;
                    moveLayerToFolderByName(imputProject_BGItem.name + " レイヤー", project_Folder); //BG読み込んだやつ
                }
            });
        }

        //LOの読み込み
        function importLo(Material_Folder, project_Folder) {
            var material = Material_Folder.getFiles(); //piantフォルダーの中のメイン素材フォルダー

            var result = filter(material, function (folder) {
                if (String(folder.getFiles()) !== "") {
                    var allFolder = folder.getFiles(); //allFolderはメイン素材フォルダー中のフォルダー
                    var loFolder = null;

                    //allFolderの中にLOフォルダーを貰う
                    forEach(allFolder, function (folders) {
                        //ファイルの場合return false;
                        if (isFile(folders)) {
                            return false;
                        }

                        //LOの正規表現マッチできるかどうか
                        if (isLO(folders.displayName)) {
                            loFolder = folders;
                        }
                    });

                    //LOフォルダー中のファイル
                    var loFiles = loFolder.getFiles();

                    forEach(loFiles, function (targetLO) {
                        //LOファイル拡張子jpg|png|tga|tifであれば
                        if (isDefultLoName(targetLO.displayName)) {
                            var iptLOftg = app.project.importFile(new ImportOptions(targetLO)); //LO導入

                            iptLOftg.parentFolder = project_Folder;
                        }
                    });
                }
            });
        }

        //Paintの読み込み(多重組みとかテキストとか判断アラート)(再築)
        function importPaint() {
            var fileAndFolder = findSozaiFolder(PAINT_FOLDER.getFiles()).getFiles(); //メイン素材フォルダー中の全ての物

            //判断
            var textFile = false; //テキストファイルあるかどうか
            var otherFile = false; //他のファイルあるかどうか
            var multiple = false; //多重組みかどうか

            //ゴミファイルあるかどうかを検査する、ある場合はアラート
            forEach(fileAndFolder, function (fileOrFolder) {
                //ファイルの場合
                if (isFile(fileOrFolder)) {
                    //拡張子jpg|png|tga|tif|psdの場合
                    if (isPicturesName(getSuffix(fileOrFolder.displayName))) {
                        otherFile = true; //他のファイルがあります（判断）
                        importSequenceSeparate([fileOrFolder], OTHER_Folder); //独立のファイルとして導入、otherフォルダーに入れます
                        //拡張子txtの場合
                    } else if (isText(getSuffix(fileOrFolder.displayName))) {
                        textFile = true; //テキストファイルがあります（判断）
                    }
                }
            });

            //folderResultはゴミファイルを捨てたのファイルフォルダー
            var folderResult = filter(fileAndFolder, function (fileOrFolder) {
                if (isFile(fileOrFolder)) {
                    return false;
                }

                var folderName = fileOrFolder.displayName;

                //lo|pool|sheet|go|old|xxx|ts|genga|st|tmp|key|iro|dpi|ko以外！！の場合はreturn
                if (!isUnusefulName(folderName)) {
                    return !isUnusefulName(folderName);
                }
            });

            //cfinfoのファイルを消します
            var fileResult = filter(folderResult, function (folder) {
                var sequenceTgas = folder.getFiles();

                //cfinfoのファイルを消します
                removeCfinfoFiles(sequenceTgas);

                return folder;
            });

            //fileResultのフォルダーの中に名前は正常かどうかを判断する、でない場合は多重組み（歯抜け意味わかりません、まだ作っていません。）
            forEach(fileResult, function (folder) {
                var sequenceTgas = folder.getFiles(); //各セルフォルダーの中からセルtgaデータを貰う

                if (sequenceTgas.length !== 0) {
                    ///^[a-z](_[a-z]+)?\d{4}$/i  (A0001,A_shita0001,A_ue0001)普通のルールであればシーケンスとして導入
                    if (isValidSequenceNumber(sequenceTgas)) {
                        importAsSequence(sequenceTgas[0]).parentFolder = SOZAI_Folder;
                    } else {
                        //違う場合は多重組み（b0001_a1,b0001_b1）
                        multiple = true;
                        var newFolder = createProjectFolder(sequenceTgas[0].displayName.split("0")[0]); //名前一番最初の文字貰う
                        var multiple_Folder = getProjectFolder(newFolder.name); //AEフォルダーの名として作る
                        importSequenceSeparatePlus(sequenceTgas, multiple_Folder); //AEフォルダーの中に導入
                        multiple_Folder.parentFolder = SOZAI_Folder;
                    }
                } else {
                    alert("ファイルないフォルダーがありました、ご確認お願い致します。");
                }
            });

            checkOtherFiles(otherFile, "フォルダーの直下にファイルがありました、otherフォルダーに入っています。");
            checkOtherFiles(textFile, "テキストファイルが入っています、ご確認お願い致します。");
            checkOtherFiles(multiple, "多重組みがあります、もしくは名前おかしいフォルダーがあります。\n\n03_paintフォルダーに入れました、ご確認お願い致します。");
        }

        importAndMoveBG(BG_FOLDER, BG_Folder);
        importLo(PAINT_FOLDER, LO_Folder);
        importPaint();

        //loとpaintデータのサイズをチェックする、違う場合アラート
        checkLoPaintSize(LO_Folder, PAINT_Folder);

        app.endUndoGroup();
    }

    //デフォルトカメラ
    function resetDefaultCamera(comp) {
        // 3Dレイヤーが1つもない場合はcomp.activeCameraがnullとなって、デフォルトカメラにアクセスできないので、
        // ダミーレイヤーを作成し、3DレイヤーをONにしてcomp.activeCameraがnullで無いことを担保する
        /**ダミーレイヤー */
        var dummy = comp.layers.addShape();

        dummy.threeDLayer = true;
        // デフォルトカメラに確実にアクセスするため、コンポ内ににカメラレイヤーがあれば全てOFFにする
        var cams = [];

        for (var i = 1; i <= comp.numLayers; i++) {
            var cam = comp.layer(i);
            if (isCameraLayer(cam)) {
                // 後でもとに戻せるようにレイヤーオブジェクトとそのenabledを取っておく
                cams.push({ layer: cam, enabled: cam.enabled });
                // カメラレイヤーを無効（目玉をOFF）にする
                cam.enabled = false;
            }
        }
        // デフォルトカメラにアクセスして、50mmのデフォルト値に設定していく
        /**デフォルトカメラ */
        var defCam = comp.activeCamera;

        if (isCameraLayer(defCam)) {
            /**50mmの画角 */
            var AOV = 39.5977527099629;
            var deg = AOV / 2;
            var rad = (deg * Math.PI) / 180;
            var zoom = comp.width / 2 / Math.tan(rad);
            // デフォルト値に設定
            defCam.zoom.setValue(zoom);
            defCam.position.setValue([comp.width / 2, comp.height / 2, -zoom]);
            defCam.anchorPoint.setValue([comp.width / 2, comp.height / 2, 0]);
        }
        // CameraLayerのビデオスイッチ（目玉）を元に戻す
        for (var i = 0; i < cams.length; i++) {
            cams[i].layer.enabled = cams[i].enabled;
        }
        // ダミーレイヤー削除
        dummy.remove();
    }

    //layer→CompSize
    function setCompSizeSub(comp, layerWidth, layerHeight) {
        //调整后的宽度和高度相对于原始宽度和高度的差值
        //元の幅と高さに対する、調整後の幅と高さの差

        var width_DifferenceValue = layerWidth - comp.width;
        var height_DifferenceValue = layerHeight - comp.height;
        //コンポの幅と高さを指定した値に設定する
        comp.width = layerWidth;
        comp.height = layerHeight;

        if (comp.numLayers > 0) {
            for (var i = 1; i <= comp.numLayers; i++) {
                var layer = comp.layer(i);

                if (isNull(layer.parent)) {
                    var Position = layer.property("ADBE Transform Group").property("ADBE Position");

                    if (Position.numKeys == 0) {
                        var positionValue = Position.value;

                        positionValue[0] += width_DifferenceValue / 2;
                        positionValue[1] += height_DifferenceValue / 2;
                        Position.setValue(positionValue);
                    }
                }
            }
        }
    }

    //main1
    function gouseiReset(comp, width, height) {
        //gouseiコンポのサイズ変更、位置修正
        setCompSizeSub(comp, width, height);
        //カメラリセット
        resetDefaultCamera(comp);
    }

    //imputToComp(インプットされた素材をgouseiコンポに追加)
    function gouseiImport() {
        //Antiレイヤーを追加する
        function addAdjustmentLayer(comp, presetPath) {
            var myShapeLayer = comp.layers.addShape();

            myShapeLayer.name = "anti-aliasing";
            myShapeLayer.adjustmentLayer = true;
            myShapeLayer.label = 8;
            myShapeLayer.position.expression = "[thisComp.width, thisComp.height]/2;";
            var shapeProperty = myShapeLayer.property("ADBE Root Vectors Group");
            var myShapePath = (shapeProperty.addProperty("ADBE Vector Shape - Rect").property("ADBE Vector Rect Size").expression = "[thisComp.width, thisComp.height];");
            shapeProperty.addProperty("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue([1, 1, 1, 1]);
            // copyPresetApply(myShapeLayer, presetPath);
            myShapeLayer.applyPreset(presetPath);
            myShapeLayer.selected = false;

            return myShapeLayer;
        }

        //白抜きしたセルコンポを探す
        function findPaintComp(folder) {
            var result = [];

            for (var i = 1; i <= folder.numItems; i++) {
                if (isAeCompItem(folder.items[i])) {
                    result.push(folder.items[i]);
                }
            }

            //比べる（下から上までABCDの順番）
            result = result.sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });

            return result;
        }

        //セルコンポをgouseiコンポに逆追加する
        function addAVLayerToComp(comp, folder) {
            for (var h = folder.length - 1; h >= 0; h--) {
                var cellComp = comp.layers.add(folder[h]);
                cellComp.moveToEnd();
            }
        }

        //LOをコンポに追加
        function addLOToComp(comp, projectFolderItem, number, isMultiply, isUP, moveToEnd) {
            if (isUP == true) {
                for (var k = 1; k <= projectFolderItem.numItems; k++) {
                    if (projectFolderItem instanceof FolderItem && projectFolderItem.item(k) instanceof FootageItem) {
                        var targetLOItem = comp.layers.add(projectFolderItem.item(k));

                        targetLOItem.label = number; //ラベル
                        if (isMultiply == true) {
                            targetLOItem.blendingMode = BlendingMode.MULTIPLY; //モード乗算
                        } else {
                            targetLOItem.blendingMode = BlendingMode.NORMAL; //モード通常
                        }
                        if (projectFolderItem.item(k) instanceof CompItem) {
                            targetLOItem.timeRemapEnabled = true;
                            targetLOItem.property("ADBE Time Remapping").setInterpolationTypeAtKey(1, KeyframeInterpolationType.HOLD);
                            targetLOItem.property("ADBE Time Remapping").removeKey(2);
                            targetLOItem.outPoint = comp.duration;
                        }
                        if (moveToEnd) {
                            targetLOItem.moveToEnd();
                        } else {
                            targetLOItem.moveToBeginning();
                        }
                        targetLOItem.selected = false;
                    }
                }
            }
        }

        //ペイントをコンポに追加
        function createPaintComp(mainFolder, subFolder, number) {
            var result = [];

            for (var j = 1; j <= mainFolder.numItems; j++) {
                var item = mainFolder.items[j];
                if (isAeFootageItem(item)) {
                    var compName = item.name.split("[")[0];
                    newComp = app.project.items.addComp(compName, item.width, item.height, item.pixelAspect, item.duration, item.frameRate);
                    var sourceLayer = newComp.layers.add(item, item.duration);
                    var fx1 = sourceLayer.property("ADBE Effect Parade").addProperty("ADBE Color Key").property("ADBE Color Key-0001").setValue([1, 1, 1, 1]);
                    newComp.label = number;
                    result.push(newComp);
                }
            }

            //比べる、必ず英語アルファベットabcdefgの順番
            result = result.sort(function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });

            //unshift,逆でgouseiコンポに追加
            for (var h = result.length - 1; h >= 0; h--) {
                result[h].parentFolder = subFolder;
                if (Anti_Check.value == true) {
                    addAdjustmentLayer(result[h], MYPRESET_PATH);
                }
            }
        }

        //多重組みの場合ペイントをコンポに追加
        function createMultiplePaintComp(mainFolder, subFolder, number) {
            var regx = /^[a-z]$/i;

            for (var i = 1; i <= mainFolder.numItems; i++) {
                if (regx.test(mainFolder.items[i].name) && mainFolder.items[i] instanceof FolderItem) {
                    var compName = mainFolder.items[i].item(1).name.split("0")[0];
                    var newComp = app.project.items.addComp(compName, mainFolder.items[i].item(1).width, mainFolder.items[i].item(1).height, mainFolder.items[i].item(1).pixelAspect, Number(mainFolder.items[i].numItems) / FRAMERATE, FRAMERATE);
                    newComp.label = number;
                    newComp.preserveNestedFrameRate = true;
                    newComp.parentFolder = subFolder;

                    for (var j = 1; j <= mainFolder.items[i].numItems; j++) {
                        var item = mainFolder.items[i].items[j];
                        if (isAeFootageItem(item)) {
                            var sourceLayer = newComp.layers.add(item, item.duration);
                            var fx1 = sourceLayer.property("ADBE Effect Parade").addProperty("ADBE Color Key").property("ADBE Color Key-0001").setValue([1, 1, 1, 1]);
                            sourceLayer.inPoint = (j - 1) / FRAMERATE;
                            sourceLayer.outPoint = j / FRAMERATE;
                        }
                    }
                    if (Anti_Check.value == true) {
                        addAdjustmentLayer(newComp, MYPRESET_PATH).moveToBeginning();
                    }
                }
            }
        }

        //BGを複製し、コンポサイズ調整、LOをBGの中に追加
        function dupBg(folderItem, isCopyBG) {
            var result = [];
            var numItems = folderItem.numItems; // 必ず先に宣言、ではないと永遠に繰り返す

            for (var i = 1; i <= numItems; i++) {
                if (folderItem.items[i] instanceof CompItem) {
                    if (LO_Folder.numItems !== 0) {
                        if (LO_Folder.item(1).width != 0 && LO_Folder.item(1).height != 0) {
                            if (BG_Size_Check.value == true) {
                                folderItem.items[i].width = LO_Folder.item(1).width;
                                folderItem.items[i].height = LO_Folder.item(1).height;
                                forEachLayers(folderItem.items[i], function (layer) {
                                    // prettier-ignore
                                    layer.property("ADBE Transform Group").property("ADBE Position").setValue([LO_Folder.item(1).width / 2, LO_Folder.item(1).height / 2, 0]);
                                });
                            }

                            if (isCopyBG) {
                                addLOToComp(folderItem.items[i], LO_Folder, Number(Lo_Label_EDT.text), Lo_Multiply_Check.value, Ue_R_Btn.value, false);
                                addLOToComp(folderItem.items[i], LO_Folder, Number(Lo_Label_EDT.text), Lo_Multiply_Check.value, Shita_R_Btn.value, false);
                            }
                        }
                    }

                    if (isCopyBG) {
                        var dupBg = folderItem.items[i].duplicate();
                        result.push(dupBg);
                    } else {
                        result.push(folderItem.items[i]);
                    }
                }
            }

            return result;
        }

        //複製したBGをgouseiコンポに追加
        function addBgToComp(comp, items, labelNumber, isCopyBG) {
            forEach(items, function (item, index) {
                if (isCopyBG) {
                    item.name = "bg" + (index + 1);
                    var BgLayer = comp.layers.add(item);
                    BgLayer.label = labelNumber;
                    BgLayer.moveToEnd();
                } else {
                    var BgLayer = comp.layers.add(item);
                    BgLayer.label = labelNumber;
                    BgLayer.moveToEnd();
                }
            });
        }

        createPaintComp(SOZAI_Folder, SOZAI_COMP_Folder, Number(Paint_Label_EDT.text));
        createMultiplePaintComp(SOZAI_Folder, SOZAI_COMP_Folder, Number(Paint_Label_EDT.text));
        addAVLayerToComp(gousei_Comp, findPaintComp(SOZAI_COMP_Folder));
        addLOToComp(gousei_Comp, LO_Folder, Number(Lo_Label_EDT.text), !copy_BG_check.value, Ue_R_Btn.value, true);
        addBgToComp(gousei_Comp, dupBg(BG_Folder, copy_BG_check.value), Number(BG_Label_EDT.text), copy_BG_check.value);
        addLOToComp(gousei_Comp, LO_Folder, Number(Lo_Label_EDT.text), !copy_BG_check.value, Shita_R_Btn.value, true);
    }

    //レイアウトサイズとペイントサイズを検査する
    function checkLoPaintSize(mainFolder, subFolder) {
        if (mainFolder.numItems !== 0) {
            if (mainFolder.item(1).width != 0 && mainFolder.item(1).height != 0) {
                var alertFlag = false;

                forEachItems(subFolder, function (item) {
                    if (item.width != 0 && item.height != 0 && isAeFootageItem(item)) {
                        if (mainFolder.item(1).width != item.width || mainFolder.item(1).height != item.height) {
                            alertFlag = true;
                        }
                    }
                });

                if (alertFlag == true) {
                    alert("レイアウトのサイズと、セルのサイズが一致しません。\nコンポサイズに気を付けてください。");
                }
            }
        } else {
            alert("loがありませんでした、コンポサイズはチェックできませんでした。\n \n恐らくBG Onlyだと思います。コンポサイズ気を付けてください。");
        }
    }

    //すべてのプロジェクトアイテム選択解除
    function allProjectItemUnselected() {
        for (var i = 1; i <= app.project.numItems; i++) {
            app.project.items[i].selected === true ? (app.project.items[i].selected = false) : null;
        }
    }

    //コンポをレンダーキューアイテムに追加する
    function addCompToRenderQueue(compItem) {
        return app.project.renderQueue.items.add(compItem); //renderQueComp instanceof RnderQueueItem
    }

    //レンダーキューアイテムを消します
    function removeRQItems(number) {
        if (app.project.renderQueue.items !== null) {
            for (var i = 1; i <= number; i++) {
                app.project.renderQueue.item(1).remove();
            }
        }
    }

    //レンダーキューアイテムのステータスを変更する
    //二つ目のmain処理
    function changeRenderQueueItemsStatus() {
        var RQ_onLineMovie = onLineMovie_Check.value ? 1 : 0;
        var RQ_still = Still_Check.value ? 1 : 0;
        var APP_randerItems = RQ_onLineMovie + RQ_still;

        //スチールかどうかを断言する
        function isStill(text) {
            return /jpg|png|tif|psd/i.test(text);
        }

        //ムービーかどうかを断言する
        function isMovie(text) {
            return /mov/i.test(text);
        }

        //元のレンダーキューアイテムからパスを貰う（ファイル名の拡張子で判断しています）
        function getPathFromRenderQueue(value, checkSuffix) {
            var path = "";

            if (value) {
                for (var i = 1; i <= app.project.renderQueue.numItems; i++) {
                    var item = app.project.renderQueue.items[i];
                    var fileName = item.outputModule(1).file.name;

                    if (checkSuffix(getSuffix(fileName))) {
                        path = item.outputModule(1).file.parent.fsName;
                    }
                }
            }

            return path;
        }

        //現在のレンダーアイテムの書き出し先のパスを取得
        //スチールの場合
        var stillPath = getPathFromRenderQueue(Still_Check.value, isStill);

        //オンラインムービーの場合
        var onLineMoviePath = getPathFromRenderQueue(onLineMovie_Check.value, isMovie);

        //オフラインムービーの場合
        var offLineMoviePath = getPathFromRenderQueue(offLineMovie_Chcek.value, isMovie);

        //レンダーキュー設定
        //一度レンダーキュー消す
        removeRQItems(APP_randerItems);

        //オンラインムービー名の設定
        var onLineRenderName = "";
        switch (String(onLine_OutputName_Setting_DropList.selection)) {
            case "コンポジション名":
                onLineRenderName = "[compName]";
                break;
            case "コンポジション名+フレーム":
                onLineRenderName = "[compName]_F[durationFrames]";
                break;
            case "コンポジション名+check":
                onLineRenderName = "[compName]_check";
                break;
        }

        //オフラインムービー名の設定
        var offLineRenderName = "";
        switch (String(offLine_OutputName_Setting_DropList.selection)) {
            case "コンポジション名":
                offLineRenderName = "[compName]";
                break;
            case "コンポジション名+フレーム":
                offLineRenderName = "[compName]_F[durationFrames]";
                break;
            case "コンポジション名+check":
                offLineRenderName = "[compName]_check";
                break;
        }

        //still名の設定
        var stillRenderName = "";
        switch (String(Still_OutputName_Setting_DropList.selection)) {
            case "コンポジション名":
                stillRenderName = "[compName]";
                break;
            case "コンポジション名+フレーム":
                stillRenderName = "[compName]_F[durationFrames]";
                break;
            case "コンポジション名+check":
                stillRenderName = "[compName]_check";
                break;
        }

        var stre = true;
        var sts = true;
        var onre = true;
        var ons = true;
        var offs = true;
        var compIndexes = [];

        //先にコンポのインデックスを保存する
        //逆探す
        for (var i = RENDER_Folder.numItems; i >= 1; i--) {
            if (RENDER_Folder.item(i) instanceof CompItem) {
                compIndexes.push(i);
            }
        }

        //順番にする
        compIndexes.sort();

        //ここからレンダーフォルダーのアイテムをレンダーキューに追加する
        for (var h = 0; h < compIndexes.length; h++) {
            //ここのrenderItemはレンダーキューのアイテムではありません！
            var renderItem = RENDER_Folder.item(compIndexes[h]);

            if (renderItem instanceof CompItem) {
                //still
                //このforのやつちょっとヤバい、もっといい方法があったら、修正いたします。
                for (var n = 1; n <= Number(KY_CutNumber_EDT.text) - compIndexes.length + 1; n++) {
                    if (Still_Check.value == true) {
                        var motoLbael = renderItem.label;
                        renderItem.label = 1;
                        renderItem.openInViewer();
                        app.executeCommand(2104);
                        //ここもちょっとやばい
                        for (var j = 1; j <= app.project.renderQueue.numItems; j++) {
                            var outPutName = app.project.renderQueue.items[j].outputModule(1).file.fsName.split(".")[0];
                            //ここも不安定だよなぁ。。大丈夫のか。。
                            if (outPutName.indexOf("(") != -1) {
                                var myRQstill = app.project.renderQueue.items[j];
                                //テンプレ名前;
                                try {
                                    myRQstill.applyTemplate(String(Still_Template_Name_DropList.selection));
                                    myRQstill.timeSpanStart = (BOLD + 1) / FRAMERATE; //開始時間
                                    myRQstill.timeSpanDuration = 1 / FRAMERATE; //デュレーション
                                } catch (e) {
                                    stre = false;
                                }
                                //出力モジュール
                                try {
                                    myRQstill.outputModule(1).applyTemplate(String(Still_OutputModule_Template_Name_DropList.selection));
                                    myRQstill.outputModule(1).file = new File(stillPath + "/" + stillRenderName);
                                } catch (e) {
                                    sts = false;
                                }
                            }
                        }
                    }
                }

                //オンラインムービー
                if (onLineMovie_Check.value == true) {
                    renderItem.label = 8;
                    var myRQon = addCompToRenderQueue(renderItem);
                    try {
                        myRQon.applyTemplate(String(Movie_Template_Name_DropList.selection));
                    } catch (e) {
                        onre = false;
                    }
                    try {
                        myRQon.outputModule(1).applyTemplate(String(onLine_OutputModule_Template_Name_DropList.selection));
                        myRQon.outputModule(1).file = new File(onLineMoviePath + "/" + onLineRenderName);
                    } catch (e) {
                        ons = false;
                    }

                    //オフラインムービーあればここで
                    if (offLineMovie_Chcek.value == true) {
                        myRQon.outputModules.add();
                        try {
                            myRQon.outputModule(2).applyTemplate(String(offLine_OutputModule_Template_Name_DropList.selection));
                            myRQon.outputModule(2).file = new File(offLineMoviePath + "/" + offLineRenderName);
                        } catch (e) {
                            offs = false;
                        }
                    }
                    renderItem.label = motoLbael;
                }
            }
        }

        //レンダー設定系がなければアラート
        checkTemplateStatus(stre, "stillのレンダリング設定");
        checkTemplateStatus(sts, "stillの出力モジュール");
        checkTemplateStatus(onre, "オンラインムービーのレンダリング設定");
        checkTemplateStatus(ons, "オンラインムービーの出力モジュール");
        checkTemplateStatus(offs, "オフラインムービーの出力モジュール");

        !app.project.renderQueue.showWindow(false) ? app.project.renderQueue.showWindow(false) : null;

        app.project.renderQueue.showWindow(true);
    }

    //テンプレステータスチェックします,なければアラート
    function checkTemplateStatus(templateExists, templateName) {
        if (templateExists == false) {
            alert(templateName + "のテンプレートが見つかりませんでした。適用されていません。\n名前等の設定を確認してください。");
        }
    }

    //"兼用"レイヤーを作ります
    function createKeyouLayer(comp, bold, frameRate) {
        if (comp.layer("兼用カット") || comp.layer("兼用")) {
        } else {
            var keyou_Layer = comp.layers.addText("兼用");

            var textAnimatorPoP = keyou_Layer.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
            textAnimatorPoP.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
            // prettier-ignore
            textAnimatorPoP.property("ADBE Text Animator Properties").property("ADBE Text Fill Color").setValue([200 / 255, 200 / 255, 200 / 255, 1]); //グレー

            keyou_Layer.property("ADBE Transform Group").property("ADBE Scale").setValue([95, 95]);
            keyou_Layer.property("ADBE Transform Group").property("ADBE Position").expression = "pos = [0, thisComp.height];\n" + "pos;";
            // keyou_Layer.property("ADBE Transform Group").property("ADBE Position").setValue([303, 956.2]);
            keyou_Layer.outPoint = bold / frameRate;
            var fx1 = keyou_Layer.property("ADBE Effect Parade").addProperty("ADBE Checkbox Control");
            fx1.name = "手動";

            var string =
                'var CN = thisComp.name.split("_")[2];\n' +
                "var CNreg = new RegExp('^'+CN+'$');\n" +
                'var mk = thisComp.layer("04_screenfx").source.layer("03_shake").source.layer("02_camera").source.layer("01_gousei").source.marker;\n' +
                "var nk = mk.numKeys;\n" +
                'var out = "";\n' +
                "\n" +
                "if(nk != 1){\n" +
                'if(!effect("手動")("チェックボックス").value){\n' +
                "for(var i = 1;i<=nk;i++){\n" +
                "if(!mk.key(i).comment.match(CNreg)){\n" +
                'if(!mk.key(i).comment.match(/END/i) && !mk.key(i).comment.match(/_/) && mk.key(i).comment != ""){\n' +
                'out += mk.key(i).comment+" ";\n' +
                "}\n" +
                "}\n" +
                "}\n" +
                'if(out == "") out;\n' +
                'else "兼用:"+out;\n' +
                "}else value;\n" +
                "}else out\n";

            keyou_Layer.property("ADBE Text Properties").property("ADBE Text Document").expression = string;
            keyou_Layer.selected = false;
        }
    }

    //チェックボックス制御のエクスプレッション
    function checkBox_EXP() {
        var checkBox_EXP =
            'var CN = thisComp.name.split("_")[2];\n' +
            "var CNreg = new RegExp('^'+CN+'$');\n" +
            'var mk = thisLayer.source.layer("03_shake").source.layer("02_camera").source.layer("01_gousei").source.marker;\n' +
            "var nk = mk.numKeys;\n" +
            "var bold = thisLayer.inPoint;\n" +
            "var flag = false;\n" +
            "\n" +
            "if(nk < 1){value;}\n" +
            "else{\n" +
            "for(var i = 1; i <= nk; i++){\n" +
            "if(mk.key(i).comment.match(CNreg)){\n" +
            "flag = true;\n" +
            "break;\n" +
            "}\n" +
            "}\n" +
            "if(flag == true){\n" +
            "var kt = mk.key(i).time;\n" +
            "time+kt-bold\n" +
            "}\n" +
            "else{value;}\n" +
            "}";

        return checkBox_EXP;
    }

    //04_screenfxレイヤーのタイムリマップを開く、エクスプレッションを追加する
    function openTimeRemapAddExp(comp, compLayer, bold, frameRate) {
        if (comp.layer("兼用カット") || comp.layer("兼用")) {
            if (compLayer.timeRemapEnabled == false) {
                compLayer.timeRemapEnabled = true;
                compLayer.property("ADBE Time Remapping").setValueAtTime((bold + 1) / frameRate, 0);
                //compLayer.property("ADBE Time Remapping").setInterpolationTypeAtKey(1, KeyframeInterpolationType.HOLD);
                compLayer.property("ADBE Time Remapping").removeKey(2);
                compLayer.property("ADBE Time Remapping").expression = checkBox_EXP();
            }
        }
    }

    //gouseiコンポからscreenfxコンポまでマーカーを打って各コンポの尺変更
    //三つ目のmain処理
    function markerDuration() {
        var cutTimes = []; //ユーザー入力されたvalue
        var durationTime = [];
        var dufaultFrame = 100;
        var singleSheetFrame = 144;
        var targetComp = RENDER_Folder.item(1);

        for (var k = 0; k < KY_CutNumber_EDT.text; k++) {
            if (Second_TXT_INDEX[k].text.length != 0) {
                var Second_Number = FRAMERATE * Number(Second_TXT_INDEX[k].text);
            } else {
                var Second_Number = 0;
            }
            if (Koma_TXT_INDEX[k].length != 0) {
                var Koma_Number = Number(Koma_TXT_INDEX[k].text);
            } else {
                var Koma_Number = 0;
            }

            cutTimes.push(Second_Number + Koma_Number);
            durationTime.push((Second_Number + Koma_Number) / FRAMERATE);
        }

        //144コマ割れるかどうかを判断する
        function calcFullSheetFrames(frame) {
            if (frame < singleSheetFrame) {
                return singleSheetFrame;
            } else {
                if (frame % singleSheetFrame > 0) {
                    return frame - (frame % singleSheetFrame) + singleSheetFrame;
                } else if (frame === singleSheetFrame) {
                    return frame + singleSheetFrame;
                } else if (frame === singleSheetFrame + singleSheetFrame) {
                    return frame + singleSheetFrame + singleSheetFrame;
                } else {
                    return frame;
                }
            }
        }

        //100コマ割れるかどうかを判断する
        function calcDufaultFrames(frame) {
            if (frame < dufaultFrame) {
                return dufaultFrame;
            } else {
                if (frame % dufaultFrame > 0) {
                    return frame - (frame % dufaultFrame) + dufaultFrame;
                } else if (frame === dufaultFrame) {
                    return frame + dufaultFrame;
                } else if (frame === dufaultFrame + dufaultFrame) {
                    return frame + dufaultFrame + dufaultFrame;
                } else {
                    return frame;
                }
            }
        }

        //新しいマーカーを作る
        function newMarker(comment, duration) {
            var marker = new MarkerValue(comment);
            marker.duration = duration;
            return marker;
        }

        //144コマ刻みのチェックボックスしてるかどうか
        function judgmentSheetSlash(value, frame) {
            if (value === true) {
                frame = calcFullSheetFrames(frame); //チェックの場合は144切る
            } else {
                frame = calcDufaultFrames(frame); //チェックしないの場合は100切る
            }

            return frame;
        }

        //compItemにマーカーを追加する
        function addMarkersToComp(compItem, cutDurations) {
            var projectFolerName = app.project.file.parent.name; //プロジェクトのフォルダーname
            var cutNo = projectFolerName.split("_");
            var markerStartTime = 0;
            var markerComment = [];
            var underBar;
            if (tittleAndEpisode_Chcek.value == true) {
                underBar = 2;
            } else {
                underBar = 1;
            }
            //プロジェクトフォルダーからカットnumberをgetする
            for (var h = underBar; h < cutNo.length; h++) {
                markerComment.push(cutNo[h]);
            }
            //カットを尺をgetする
            for (var i = 0; i < cutDurations.length; i++) {
                var markerDuration = cutDurations[i];
                var marker_en = newMarker(markerComment[i], markerDuration / FRAMERATE);
                marker_en.label = i + 1; //レッドから始まる、毎回+１
                marker_en.protectedRegion = true; //レスポンシブデザインー時間を有効にする
                //set marker
                compItem.markerProperty.setValueAtTime(markerStartTime, marker_en);
                markerStartTime = markerStartTime + judgmentSheetSlash(isSheetFrameSlash_Check.value, markerDuration) / FRAMERATE; //毎回+
            }
        }

        //layerItemにマーカーを追加する（基本compと同じ、但しEnd_markerも一緒に追加する）
        function addMarkersToLayer(layerItem, cutDurations) {
            var projectFolerName = app.project.file.parent.name;
            var cutNo = projectFolerName.split("_");
            var markerStartTime = 0;
            var markerComment = [];
            var underBar;
            if (tittleAndEpisode_Chcek.value == true) {
                underBar = 2;
            } else {
                underBar = 1;
            }
            //プロジェクトフォルダーからカットnumberをgetする
            for (var h = underBar; h < cutNo.length; h++) {
                markerComment.push(cutNo[h]);
            }
            //カットを尺をgetする
            for (var i = 0; i < cutDurations.length; i++) {
                var markerDuration = cutDurations[i];
                var marker_en = newMarker(markerComment[i], markerDuration / FRAMERATE);
                var end_marker_en = new MarkerValue(markerComment[i] + "End");
                marker_en.label = i + 1; //レッドから始まる、毎回+１
                marker_en.protectedRegion = true; //レスポンシブデザインー時間を有効にする
                end_marker_en.protectedRegion = false; //レスポンシブデザインー時間を無効にする

                //Start marker
                layerItem.property("ADBE Marker").setValueAtTime(markerStartTime, marker_en);
                //End marker
                layerItem.property("ADBE Marker").setValueAtTime(markerStartTime + durationTime[i] - 1 / FRAMERATE, end_marker_en); //durationTime[i] = カットの尺
                markerStartTime = markerStartTime + judgmentSheetSlash(isSheetFrameSlash_Check.value, markerDuration) / FRAMERATE;
            }
        }

        //兼用の場合gouseiコンポにマーカーを打つ
        if (KY_CutNumber_EDT.text != 1) {
            for (var L = 1; L <= KY_CutNumber_EDT.text; L++) {
                //Comp
                //@@
                addMarkersToComp(gousei_Comp, cutTimes); //gougei_Comp
                addMarkersToComp(camera_Comp, cutTimes); //camera_Comp
                addMarkersToComp(shake_Comp, cutTimes); //shake_Comp
                addMarkersToComp(screenfx_Comp, cutTimes); //screenfx_Comp

                //Layer
                //@@
                //addMarkersToLayer(frame_Layer, cutDurations); //frame_Layer
                addMarkersToLayer(gougei_Layer, cutTimes); //gougei_Layer
                addMarkersToLayer(camera_Layer, cutTimes); //camera_Layer
                addMarkersToLayer(shake_Layer, cutTimes); //shake_Layer
            }
        }

        //Judgment takeNumber
        function judgmentTakeNumber(value) {
            var newName;

            if (value == true) {
                newName = getCutNames(AEP_NAME, T_Check.value, TimingNotation.text, Number(KY_CutNumber_EDT.text));
            } else {
                newName = getCutNamesNoTakeNumber(AEP_NAME, T_Check.value, TimingNotation.text, Number(KY_CutNumber_EDT.text));
            }

            return newName;
        }

        var newName = judgmentTakeNumber(noTakeNumer_Check.value);
        sameAsDuplicate(targetComp, cutTimes / FRAMERATE, newName);

        //stagecompの現在の尺
        var compDurations = [];

        //gouseiコンポからscreenfxまで尺を切る
        for (var m = 1; m <= COMP_Folder.numItems; m++) {
            if (COMP_Folder.item(m) instanceof CompItem) {
                compDurations.push(COMP_Folder.item(m).duration);
            }
            //兼用がない時の処理
            if (KY_CutNumber_EDT.text == 1) {
                //コンポアイテムの時に尺を切っていく
                if (COMP_Folder.item(m) instanceof CompItem) {
                    gousei_Comp.duration = Number(durationTime[0]);
                    camera_Comp.duration = Number(durationTime[0]);
                    shake_Comp.duration = Number(durationTime[0]);
                    screenfx_Comp.duration = Number(durationTime[0]);
                }
            } else {
                var latMarker_Time = gousei_Comp.markerProperty.keyTime(Number(KY_CutNumber_EDT.text)) * FRAMERATE; //兼用カットの最後のマーカー
                var lastCutDuration = cutTimes[Number(KY_CutNumber_EDT.text) - 1]; //兼用ラストカットの尺
                var cola = String(latMarker_Time + lastCutDuration); //上二つ足した数
                var colap = String(Number(cola) + 100); //colaに+100
                //colapが三桁の時
                if (colap.length == 3) {
                    var colapp = Number(colap.charAt(0) + "00");
                } else {
                    var colapp = Number(colap.charAt(0) + colap.charAt(1) + "00");
                }
                COMP_Folder.item(m).duration = colapp / FRAMERATE;
            }
        }

        //stagecompの各レイヤーのアウトポイントが尺変更前の尺と同じレイヤーがあれば現在の尺のアウトポイントで切る
        for (var o = 1; o <= COMP_Folder.numItems; o++) {
            if (COMP_Folder.item(o) instanceof CompItem) {
                for (var p = 1; p <= COMP_Folder.item(o).numLayers; p++) {
                    var layerDR = COMP_Folder.item(o).layer(p).outPoint;
                    if (layerDR == Number(compDurations[0])) {
                        if (COMP_Folder.item(o).layer(p).locked != true) {
                            COMP_Folder.item(o).layer(p).outPoint = COMP_Folder.item(o).duration;
                        } else {
                            COMP_Folder.item(o).layer(p).locked = false;
                            COMP_Folder.item(o).layer(p).outPoint = COMP_Folder.item(o).duration;
                            COMP_Folder.item(o).layer(p).locked = true;
                        }
                    }
                }
            }
        }

        //兼用カットレイヤーと兼用レイヤーがなければ
        var compIndexes = [];

        //先にコンポのインデックスを保存する
        //逆探す
        for (var i = RENDER_Folder.numItems; i >= 1; i--) {
            if (RENDER_Folder.item(i) instanceof CompItem) {
                compIndexes.push(i);
            }
        }

        //順番にする
        compIndexes.sort();

        //RenderCompの中に"兼用"レイヤー作成、04_screenfxレイヤーのタイムリマップを開く、エクスプレッションを追加する
        for (var h = 0; h < compIndexes.length; h++) {
            var Render_items = RENDER_Folder.item(compIndexes[h]);
            if (Render_items instanceof CompItem) {
                createKeyouLayer(Render_items, BOLD, FRAMERATE);
                openTimeRemapAddExp(Render_items, Render_items.layer("04_screenfx"), BOLD, FRAMERATE);
            }
        }
    }

    //workJson内容
    function createWorkJson() {
        //書き込み内容
        // prettier-ignore
        var workSetting_Jason =

            "{" +

            "\n" +
            "\n" +
            '"renderFolder_Name": ' + '"' + Render_Folder_Name.text + '"' + "," +
            "\n" +
            "\n" +
            '"stageComp_Name": ' + '"' + stageComp_Folder_Name.text + '"' + "," +
            "\n" +
            "\n" +
            '"paintFolder_Name": ' + '"' + Sozai_Folder_Name.text + '"' + "," +
            "\n" +
            "\n" +
            '"paintCompFolder_Name": ' + '"' + sozaiComp_Folder_Name.text + '"' + "," +
            "\n" +
            "\n" +
            '"bold": ' + BOLD_KOMA.text + "," +
            "\n" +
            "\n" +
            '"frameRate": ' + Framerate.text + "," +
            "\n" +
            "\n" +
            '"onLineMovie(true/flase)": ' + onLineMovie_Check.value + "," +
            "\n" +
            "\n" +
            '"offLineMovie(true/flase)": ' + offLineMovie_Chcek.value + "," +
            "\n" +
            "\n" +
            '"still(true/flase)": ' + Still_Check.value + "," +
            "\n" +
            "\n" +
            '"randeringSettingTemplate_Name(movie)": ' + '"' + String(Movie_Template_Name_DropList.selection) + '"' + "," +
            "\n" +
            "\n" +
            '"randeringSettingTemplate_Name(still)": ' + '"' + String(Still_Template_Name_DropList.selection) + '"' + "," +
            "\n" +
            "\n" +
            '"outputModuleTemplate_Name(onLine)": ' + '"' + String(onLine_OutputModule_Template_Name_DropList.selection) + '"' + "," +
            "\n" +
            "\n" +
            '"outputModuleTemplate_Name(offLine)": ' + '"' + String(offLine_OutputModule_Template_Name_DropList.selection) + '"' + "," +
            "\n" +
            "\n" +
            '"outputModuleTemplate_Name(still)": ' + '"' + String(Still_OutputModule_Template_Name_DropList.selection) + '"' + "," +
            "\n" +
            "\n" +
            '"Output_Name(onLine)": ' + '"' + String(onLine_OutputName_Setting_DropList.selection) + '"' + "," +
            "\n" +
            "\n" +
            '"Output_Name(offLine)": ' + '"' + String(offLine_OutputName_Setting_DropList.selection) + '"' + "," +
            "\n" +
            "\n" +
            '"Output_Name(still)": ' + '"' + String(Still_OutputName_Setting_DropList.selection) + '"' + "," +
            "\n" +
            "\n" +
            '"timmingTake_Mark": ' + '"' + TimingNotation.text + '"' + "," +
            "\n" +
            "\n" +
            '"folderNameHaveUnderBar?": ' + tittleAndEpisode_Chcek.value + "," +
            "\n" +
            "\n" +
            '"AEPNameCutNumberHaveTakeNumber?": ' + noTakeNumer_Check.value + "," +
            "\n" +
            "\n" +
            '"isSheetFrameSlash?": ' + isSheetFrameSlash_Check.value +
            "\n" +
            "\n" +

            "}";

        return workSetting_Jason;
    }

    //localJson内容
    function createLocalWorkJson() {
        //書き込み内容
        // prettier-ignore
        var lcoalString =

            "{" +

            "\n" +
            "\n" +
            '"bgLayer_Label": ' + BG_Label_EDT.text + "," +
            "\n" +
            "\n" +
            '"paintLayer_Label": ' + Paint_Label_EDT.text + "," +
            "\n" +
            "\n" +
            '"loLayer_Label": ' + Lo_Label_EDT.text + "," +
            "\n" +
            "\n" +
            '"anti_aliasing(true/false)": ' + Anti_Check.value + "," +
            "\n" +
            "\n" +
            '"loSizeToBg(true/false)": ' + BG_Size_Check.value + "," +
            "\n" +
            "\n" +
            '"loLayer_PositionInTop(true/false)": ' + Ue_R_Btn.value + "," +
            "\n" +
            "\n" +
            '"loLayer_PositionInDown(true/false)": ' + Shita_R_Btn.value + "," +
            "\n" +
            "\n" +
            '"loLayerModeMultiply(true/false)": ' + Lo_Multiply_Check.value + "," +
            "\n" +
            "\n" +
            '"copyBgAddLo(true/flase)": ' + copy_BG_check.value + "," +
            "\n" +
            "\n" +
            '"AntiName": ' + '"' + AntiName_EDT.text + '"' +
            "\n" +
            "\n" +

            "}";

        return lcoalString;
    }

    //Jsonを作成する
    function createJson(file, mainFolder, koFolder, textContents, textName, msg) {
        if (file.exists) {
            file.open("w");
            file.write(textContents);
            file.close();
            alert(msg);
        } else {
            var file = new File(String(koFolder) + "/" + textName);
            var autoimitationFlg = new Folder(mainFolder);
            var workFlg = new Folder(koFolder);
            autoimitationFlg.create();
            workFlg.create();
            file.open("w");
            file.write(textContents);
            file.close();
            alert(msg);
        }
    }

    //WorkJsonを読みます
    function readWorkJson(file) {
        if (file.exists == true) {
            file.open("r");
            var content = file.read();
            file.close();

            var jsonObject = eval("(" + content + ")"); //jasonから貰ったstringをオブジェクトに変更します

            //作品設定の変数置き換え
            Render_Folder_Name.text = jsonObject["renderFolder_Name"];
            stageComp_Folder_Name.text = jsonObject["stageComp_Name"];
            Sozai_Folder_Name.text = jsonObject["paintFolder_Name"];
            sozaiComp_Folder_Name.text = jsonObject["paintCompFolder_Name"];

            BOLD_KOMA.text = jsonObject["bold"];
            Framerate.text = jsonObject["frameRate"];
            onLineMovie_Check.value = jsonObject["onLineMovie(true/flase)"];
            offLineMovie_Chcek.value = jsonObject["offLineMovie(true/flase)"];
            Still_Check.value = jsonObject["still(true/flase)"];

            enableDropDownListsLit([Movie_Template_Name_DropList, onLine_OutputModule_Template_Name_DropList, onLine_OutputName_Setting_DropList], jsonObject["onLineMovie(true/flase)"]);
            enableDropDownListsLit([offLine_OutputModule_Template_Name_DropList, offLine_OutputName_Setting_DropList], jsonObject["offLineMovie(true/flase)"]);
            enableDropDownListsLit([Still_Template_Name_DropList, Still_OutputModule_Template_Name_DropList, Still_OutputName_Setting_DropList], jsonObject["still(true/flase)"]);

            //修正!？パネルに残すため(めちゃくちゃ疲れた=.=)
            updateTemplateDropdownList(jsonObject["randeringSettingTemplate_Name(movie)"], Movie_Template_Name_DropList);
            updateTemplateDropdownList(jsonObject["randeringSettingTemplate_Name(still)"], Still_Template_Name_DropList);
            updateTemplateDropdownList(jsonObject["outputModuleTemplate_Name(onLine)"], onLine_OutputModule_Template_Name_DropList);
            updateTemplateDropdownList(jsonObject["outputModuleTemplate_Name(offLine)"], offLine_OutputModule_Template_Name_DropList);
            updateTemplateDropdownList(jsonObject["outputModuleTemplate_Name(still)"], Still_OutputModule_Template_Name_DropList);
            updateTemplateDropdownList(jsonObject["Output_Name(onLine)"], onLine_OutputName_Setting_DropList);
            updateTemplateDropdownList(jsonObject["Output_Name(offLine)"], offLine_OutputName_Setting_DropList);
            updateTemplateDropdownList(jsonObject["Output_Name(still)"], Still_OutputName_Setting_DropList);

            TimingNotation.text = jsonObject["timmingTake_Mark"];

            tittleAndEpisode_Chcek.value = jsonObject["folderNameHaveUnderBar?"];

            noTakeNumer_Check.value = jsonObject["AEPNameCutNumberHaveTakeNumber?"];

            isSheetFrameSlash_Check.value = jsonObject["isSheetFrameSlash?"];
        } else {
            alert("作品設定ファイルを作成してください。");
        }
        //return myWorkText;
    }

    //LocalJsonを読みます
    function readLocalJson(file) {
        if (file.exists == true) {
            file.open("r");
            var content = file.read();
            file.close();

            var jsonObject = eval("(" + content + ")"); //jasonから貰ったstringをオブジェクトに変更します

            //ローカル設定の変数置き換え
            BG_Label_EDT.text = jsonObject["bgLayer_Label"];
            Paint_Label_EDT.text = jsonObject["paintLayer_Label"];
            Lo_Label_EDT.text = jsonObject["loLayer_Label"];
            Anti_Check.value = jsonObject["anti_aliasing(true/false)"];
            BG_Size_Check.value = jsonObject["loSizeToBg(true/false)"];
            Ue_R_Btn.value = jsonObject["loLayer_PositionInTop(true/false)"];
            Shita_R_Btn.value = jsonObject["loLayer_PositionInDown(true/false)"];
            Lo_Multiply_Check.value = jsonObject["loLayerModeMultiply(true/false)"];

            copy_BG_check.value = jsonObject["copyBgAddLo(true/flase)"];
            AntiName_EDT.text = jsonObject["AntiName"];
        } else {
            alert("ローカル設定ファイルを作成してください。");
        }
    }

    //作品設定の変数置き換え(設定されたDropListを記録したまま、分かりやすく、次回作品設定を開く時も前回の設定見えるように)
    /**最初に、一つのループを使用して、一致するレンダリングテンプレートを検索し、別のループを使用してドロップダウンリストの各オプションを反復処理し、一致するオプションを見つけます。
    一致するオプションが見つかったら、そのインデックスを記録し、ドロップダウンリストの選択オプションとして設定します。 */
    function findTemplateIndex(templateName) {
        var templates = app.project.renderQueue.item(1).templates;
        for (var i = 0; i < templates.length; i++) {
            if (templates[i] === templateName) {
                return i;
            }
        }

        // RenderQueueItem.templates でテンプレートが見つからなかった場合
        // 各出力モジュールのテンプレートを確認する
        var outputModules = app.project.renderQueue.item(1).outputModule(1).templates;
        for (var j = 0; j < outputModules.length; j++) {
            if (outputModules[j] === templateName) {
                return j;
            }
        }

        var outputName = ["コンポジション名", "コンポジション名+フレーム", "コンポジション名+check"];
        for (var h = 0; h < outputName.length; h++) {
            if (outputName[h] === templateName) {
                return h;
            }
        }

        return -1; // テンプレが探せませんでした
    }

    //↑↑↑↑findTemplateIndex(templateName)と組み合わせ使用
    function updateTemplateDropdownList(templateName, dropdownList) {
        var selectedIndex = findTemplateIndex(templateName);
        if (selectedIndex !== -1) {
            dropdownList.selection = selectedIndex;
        }
    }

    //findRenderingSetting（レンダリング設定）
    function findRenderingSetting() {
        var items = [];

        for (var i = 0; i < app.project.renderQueue.item(1).templates.length - 1; i++) {
            var template = app.project.renderQueue.item(1).templates[i];
            items.push(template);
        }

        return items;
    }

    //findOutputModuleSetting（出力モジュール設定）
    function findOutputModuleSetting() {
        var items = [];

        for (var i = 0; i < app.project.renderQueue.item(1).outputModule(1).templates.length - 6; i++) {
            var template = app.project.renderQueue.item(1).outputModule(1).templates[i];
            items.push(template);
        }

        return items;
    }

    //findOutputName（出力先）
    function findOutputName() {
        var items = ["コンポジション名", "コンポジション名+フレーム", "コンポジション名+check"];
        return items;
    }

    //HELP_Btn（？ボタン）
    function help() {
        var string =
            // prettier-ignore
            "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////\n" +
            "//\n" +
            "// Automation v3\n" +
            "// ©2023 T2_Enkou\n" +
            "// Author: T2_Enkou\n" +
            "// V2 enhancements: T2 宮城 己織\n" +
            "//\n" +
            "// Memo\n" +
            "//      - T2 宮城 己織さんのスクリプトから大抵の考えて方法を貰いました、僕はただ自分がわかる言葉で再築いたしました。\n" +
            "//      - 少し気になるところを修正？いたしましただけです。\n" +
            "//      - だと言っても、2000行以上のスクリプトは初めてですので、若干コントロールが難しい？コントロールが失ってしまった感じがします。\n" +
            "//      - もっと勉強しないと。(もちろん、撮影もそうです！)\n" +
            "//      -\n" +
            "// Version History\n" +
            "// 0.1 initial programming - 12/2022\n" +
            "// 0.5 Added UI, blessed for umf_Automation - 01/2023\n" +
            "// 1.01 Test Tittle - 02/2023\n" +
            "//      - 「ウマ娘３」使えます\n" +
            "//      - 「廃墟」使えます\n" +
            "//      - 「シャーマンキング」使えます\n" +
            "//      - 「BuddyDaddies」使えます\n" +
            "//      - 「umf」使えます\n" +
            "//      - 「くまクマ熊ベアー」使えます\n" +
            "//      - 「PDO」使えます\n" +
            "//      -\n" +
            "//      - 「劇場版ちょっとわかりません、ラジャーは使えません、コンポ構成全然違うので。\n" +
            "//      -\n" +
            "// Attention!!\n" +
            "//      - レンダーキューの「レンダリング設定」のテンプレの名前と「出力モジュール」のテンプレの名前は絶対一様しないでください。マシンがこんがらがるので！？\n" +
            "//      - レンダーキューアイテムで、必ず一番目のアイテムはstillとして、二番目のアイテムはmovとcheck_movで設定してください！\n" +
            "//      -\n" +
            "// 1.02 Massive update - 02/2023\n" +
            "//      - 素材インプットの機能を試しに追加しました、関数automation()と関数gouseiImport()です。\n" +
            "//      - 作品設定UIで素材導入する時「素材フォルダー」と「素材コンポフォルダー」二つの選択追加しました。デフォルト設定は「03_paint」です。\n" +
            "//      -\n" +
            "// 1.03 - Update - 03/2023\n" +
            "//      - 作品設定ウィンドウで新たに「haveTakeNumber?」のチェックボックスを追加しました。\n" +
            "//      - 例：「薬屋のひとりごと」の場合,　AEP name ：「KHT00_00_000_000_P1」　チェックボックス「haveTakeNumber?」をチェックしない。　　　カットナンバーの後ろテイクナンバーないので\n" +
            "//      - 例：「umf」の場合,　　　　　　　 AEP name ：「umf_00_000_1_000_1」　 チェックボックス「haveTakeNumber?」をチェックします。　　　カットナンバーの後ろテイクナンバーあるので\n" +
            "//      - 作品設定ウィンドウでバージョンと版権のテキスト追加しました。\n" +
            "//      -\n" +
            "// 1.04 - Update - 03/2023\n" +
            '//      - 廃墟でヘルプの時、BGは複製しませんのと、BG中にLO追加しませんのことをわかりましたので、ローカル設定ウィンドウで「"BG複製する、BGの中LO追加する"」のチェックボックスを追加しました。\n' +
            '//      - 例：チェックする時：umfのように、BGを複製し、名前は"bg1"にします、"bg1"の中にLO追加し、LOのモードは「乗算」。\n' +
            "//      - 例：チェックしない時：廃墟のように、元々のBG直接gouseiコンポに追加し、gouseiコンポ中のLOのモードを「乗算」にする。\n" +
            "//      - ローカル設定ファイルは一つではなく、各作品によって、別々に設定いたします。\n" +
            "//      - セルフォルダーの中に「Cfinfo.cs6」があれば、消してから素材読み込みます。\n" +
            "//      -\n" +
            "// 1.05 - Fixes - 03/2023\n" +
            "//      - 作品設定とローカル設定のファイルはtextからjsonに変更しました、これでもっと安全、安定でしょう。\n" +
            "//      - レンダーキューアイテム、一番目は必ずstill,二番目必ずmovとcheck_movを修正しました。これからはファイル名の拡張子（jpg,mov）で判断します。これで順番どっちでもいいです。\n" +
            "//      - 作品設定ウィンドウでドロップリストのアクティブは各チェックボックス（onLineMovie,offLineMovie,still）でコントロールすることにしました。\n" +
            "//      - 作品設定ウィンドウで「作品名略称」以外のedittextは、入力する時、stringの前後スペースだけ自動的に消します。（str真ん中のスペース消しません！）これで万が一ユーザー間違って入力されても問題なし。\n" +
            "//      -\n" +
            "// 1.06 - Update - 03/2023\n" +
            "//      - 「薬屋のひとりごと」ヘルプの時、各タイトルAnti違うことがあるのがわかりました、ローカル設定でantiチェックボックスの後ろ、アンチ名入力するedittext追加しました（拡張子までお願い致します。）\n" +
            "//      - 例：↑base_AEpresetフォルダーは読み込み専用なので、最初は権利ないので、できませんでしたが。何故かまたアンチプリセットを適応可能になりました。試験運用(一定期間継続)\n" +
            "//      -\n" +
            "// 1.07 - Update - 04/2023\n" +
            "//      -作品設定ウィンドウで「144コマ刻みますか」のチェックボックスを追加しました。\n" +
            "//      - 例：↑チェックする時は144フレームで切ります（丁度144と288コマの場合もっとプラス144,288コマ）、チェックしない時はデフォルトの100コマで切ります。\n" +
            "//      -ヘルプボタンの内容を変わりました、アラートだけではなく、マニュアルと更新のところを表示する。T2公式ホームページボタン追加しました。\n" +
            "//      -\n" +
            "// 1.08 - Fixes - 04/2023\n" +
            "//      -cfinfoだけではなくcatalogあれば一緒に消してから、セルを読み込みます。\n" +
            "//\n" +
            "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////";

        //myHelpWindow
        var myHelpWindow = (function (enkou) {
            var win = new Window("palette", "T2 Automation v3 HELP", [100, 0, 1080, 600]); // bounds = [left, top, right, bottom]
            this.windowRef = win;
            win.btnPanel = win.add("group", [10, 10, 1100, 600]);

            win.btnPanel.text = win.btnPanel.add("statictext", [10, 10, 900, 25], "T2 Automation v3 Instruction Manual");
            win.btnPanel.warnBtn = win.btnPanel.add("edittext", [10, 40, 950, 540], string, { multiline: true, readonly: true });

            win.btnPanel.aesBtn = win.btnPanel.add("button", [770, 550, 950, 580], "http://www.t2studio.co.jp");

            win.btnPanel.aesBtn.onClick = function () {
                openURL("http://www.t2studio.co.jp");
            };

            // Display the window
            win.center();
            win.show();
            return true;
        })(this);
    }

    //PCでフォルダーを作成する
    function createFolder(folderPath, folderName) {
        var folder = new Folder(folderPath + "/" + folderName);

        if (!folder.exists) {
            folder.create();
        }

        return folder;
    }

    //今のファイルの名前を貰う
    function getThisFileName() {
        return $.fileName.substring($.fileName.lastIndexOf("/") + 1, $.fileName.length);
    }

    //スペースでスプリット
    function splitBySpace(string, number) {
        return string.split(/\s/g)[number];
    }

    //バージョンをチェックする
    function checkVersion(severFile, localFile) {
        //sever
        var severFileMonth = splitBySpace(String(severFile.modified), 1);
        var severFileDate = splitBySpace(String(severFile.modified), 2);
        var severFileYear = splitBySpace(String(severFile.modified), 3);
        var severFileTime = splitBySpace(String(severFile.modified), 4);

        //local
        var localFileMonth = splitBySpace(String(localFile.modified), 1);
        var localFileDate = splitBySpace(String(localFile.modified), 2);
        var localFileYear = splitBySpace(String(localFile.modified), 3);
        var localFileTime = splitBySpace(String(localFile.modified), 4);

        //ローカルファイルの日にちをサーバーのファイル日にち比べる
        function sortDateAndTime() {
            //（年、月、日、時間）一つ違うのであれば、更新する
            if (localFileYear == severFileYear && localFileMonth == severFileMonth && localFileDate == severFileDate && localFileTime == severFileTime) {
                return false;
            } else {
                return true;
            }

            return undefined;
        }

        //
        function getFormattedDate() {
            var today = new Date();
            var year = today.getFullYear();
            var month = ("0" + (today.getMonth() + 1)).slice(-2);
            var day = ("0" + today.getDate()).slice(-2);
            var hours = ("0" + today.getHours()).slice(-2);
            var minutes = ("0" + today.getMinutes()).slice(-2);
            var seconds = ("0" + today.getSeconds()).slice(-2);

            return year + month + day + "_" + hours + "h" + minutes + "min";
        }

        function backUpFile(filePath) {
            var backUpFolder = createFolder(String(SCRIPT_Autoimitation_Folder) + "/", "(_back up");
            var backUpFileName = "19_autoimitation_common_win.jsx".replace(/jsx/, "bak") + getFormattedDate();

            return new File(filePath).copy(backUpFolder.fsName + "/" + backUpFileName, true);
        }

        //ユーザーから選択、更新するかどうか
        function fromSeverCopyFile(isNeedUpDate) {
            if (isNeedUpDate) {
                var updateConfirm = confirm("スクリプト更新があります、今ローカルにコピーしますか?");

                if (updateConfirm === true) {
                    var saveFile = File(String(SCRIPT_Autoimitation_Folder) + "/" + "19_autoimitation_common_win.jsx").saveDlg("Download Script", "JavaScript:*.jsx");

                    if (saveFile !== null) {
                        var downnewver = severFile.copy(saveFile, true);

                        if (downnewver) {
                            backUpFile(String(SCRIPT_Autoimitation_Folder) + "/" + "19_autoimitation_common_win.jsx");
                            alert("コピーしてバックアップが完了しました。\n\nAfter Effectsを落として、再起動してください。");
                        }
                    }
                }
            }
        }

        //run
        fromSeverCopyFile(sortDateAndTime());
    }

    //Go_Btn(onClick)
    function GO_Btn_onClick() {
        app.beginUndoGroup("runScript");

        if (isWindowsSystem()) {
            LO_Folder.numItems !== 0 ? gouseiReset(gousei_Comp, LO_Folder.item(1).width, LO_Folder.item(1).height) : null;

            markerDuration();
            changeRenderQueueItemsStatus();
            gouseiImport();
            gousei_Comp.openInViewer();
            gousei_Comp.time = 0 / FRAMERATE;
            app.project.showWindow(true);
            allProjectItemUnselected();
            //$.gc()不要になったメモリを解放し、メモリリークを防止する。
            $.gc();
            myMainWindow.close();
        }

        app.endUndoGroup();
    }

    //Tittle_Btn(onClick)
    function Tittle_Btn_onClick() {
        mySettingWindow.center();
        mySettingWindow.show();
        myMainWindow.close();
    }

    //Local_Btn(onClick)
    function Local_Btn_onClick() {
        myLocalWindow.center();
        myLocalWindow.show();
        myMainWindow.close();
    }

    //writeOut_Btn_onClick
    function writeOut_Btn_onClick() {
        createJson(AEPNAME_JSON, Autoimitation_Folder, Works_Folder, createWorkJson(), AEP_NAME[0] + "_e" + ".json", "作品設定ファイルが作成されました。スクリプトを起動しなおしてください。"); //作品設定ファイル
        mySettingWindow.close();
        myMainWindow.close();
    }

    //Local_writeOut_Btn_onClick
    function Local_writeOut_Btn_onClick() {
        createJson(LOCAL_JSON, Autoimitation_Folder, Local_Folder, createLocalWorkJson(), AEP_NAME[0] + "_LocalSettings_e.json", "ローカル設定ファイルが作成されました。スクリプトを起動しなおしてください。"); //ローカル設定ファイル
        myLocalWindow.close();
        mySettingWindow.close();
        myMainWindow.close();
    }

    //KY_CutNumber_EDT_OnChange
    function KY_CutNumber_EDT_OnChange() {
        //秒数+コマのUIをAdd
        for (var i = 2; i <= KY_CutNumber_EDT.text; i++) {
            var group = mainPanel.add("group");
            group.spacing = 120;
            var ed1 = group.add("edittext");
            ed1.preferredSize.width = 80;
            ed1.preferredSize.height = 35;
            Second_TXT_INDEX.push(ed1);

            var ed2 = group.add("edittext");
            ed2.preferredSize.width = 80;
            ed2.preferredSize.height = 35;
            Koma_TXT_INDEX.push(ed2);
        }

        myMainWindow.layout.layout(true);
        myMainWindow.layout.resize();
    }

    //myMainWindow onClick function
    //@@

    KY_CutNumber_EDT.onChange = KY_CutNumber_EDT_OnChange;
    Second_TXT_INDEX.push(Second_TXT);
    Koma_TXT_INDEX.push(Koma_TXT);
    GO_Btn.onClick = GO_Btn_onClick;
    HELP_Btn.onClick = help;
    Tittle_Btn.onClick = Tittle_Btn_onClick;
    Local_Btn.onClick = Local_Btn_onClick;

    //mySettingWindow onClick function
    //@@

    Tittle_Name.text = AEP_NAME[0];
    writeOut_Btn.onClick = writeOut_Btn_onClick;

    //myLocalWindow onClick function
    //@@

    Local_writeOut_Btn.onClick = Local_writeOut_Btn_onClick;
})(this);
