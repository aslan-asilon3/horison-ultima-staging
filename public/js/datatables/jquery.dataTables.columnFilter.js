(function($){$.fn.columnFilter=function(options){var asInitVals,i,label,th;var sRangeFormat="From {from} to {to}";var afnSearch_=new Array();var aiCustomSearch_Indexes=new Array();var oFunctionTimeout=null;var fnOnFiltered=function(){};function _fnGetColumnValues(oSettings,iColumn,bUnique,bFiltered,bIgnoreEmpty){if(typeof iColumn=="undefined")return new Array();if(typeof bUnique=="undefined")bUnique=true;if(typeof bFiltered=="undefined")bFiltered=true;if(typeof bIgnoreEmpty=="undefined")bIgnoreEmpty=true;var aiRows;if(bFiltered==true)aiRows=oSettings.aiDisplay;else aiRows=oSettings.aiDisplayMaster;var asResultData=new Array();for(var i=0,c=aiRows.length;i<c;i++){var iRow=aiRows[i];var aData=oTable.fnGetData(iRow);var sValue=aData[iColumn];if(bIgnoreEmpty==true&&sValue.length==0)continue;else if(bUnique==true&&jQuery.inArray(sValue,asResultData)>-1)continue;else asResultData.push(sValue);}
return asResultData.sort();}
function _fnColumnIndex(iColumnIndex){if(properties.bUseColVis)
return iColumnIndex;else
return oTable.fnSettings().oApi._fnVisibleToColumnIndex(oTable.fnSettings(),iColumnIndex);}
function fnCreateInput(oTable,regex,smart,bIsNumber,iFilterLength,iMaxLenght){var sCSSClass="text_filter";if(bIsNumber)
sCSSClass="number_filter";label=label.replace(/(^\s*)|(\s*$)/g,"");var currentFilter=oTable.fnSettings().aoPreSearchCols[i].sSearch;var search_init='search_init ';var inputvalue=label;if(currentFilter!=''&&currentFilter!='^'){if(bIsNumber&&currentFilter.charAt(0)=='^')
inputvalue=currentFilter.substr(1);else
inputvalue=currentFilter;search_init='';}
var input=$('<input type="text" class="'+search_init+sCSSClass+'" value="'+inputvalue+'"/>');if(iMaxLenght!=undefined&&iMaxLenght!=-1){input.attr('maxlength',iMaxLenght);}
th.html(input);if(bIsNumber)
th.wrapInner('<span class="filter_column filter_number" />');else
th.wrapInner('<span class="filter_column filter_text" />');asInitVals[i]=label;var index=i;if(bIsNumber&&!oTable.fnSettings().oFeatures.bServerSide){input.keyup(function(){oTable.fnFilter('^'+this.value,_fnColumnIndex(index),true,false);fnOnFiltered();});}else{input.keyup(function(){if(oTable.fnSettings().oFeatures.bServerSide&&iFilterLength!=0){var currentFilter=oTable.fnSettings().aoPreSearchCols[index].sSearch;var iLastFilterLength=$(this).data("dt-iLastFilterLength");if(typeof iLastFilterLength=="undefined")
iLastFilterLength=0;var iCurrentFilterLength=this.value.length;if(Math.abs(iCurrentFilterLength-iLastFilterLength)<iFilterLength){return;}
else{$(this).data("dt-iLastFilterLength",iCurrentFilterLength);}}
oTable.fnFilter(this.value,_fnColumnIndex(index),regex,smart);fnOnFiltered();});}
input.focus(function(){if($(this).hasClass("search_init")){$(this).removeClass("search_init");this.value="";}});input.blur(function(){if(this.value==""){$(this).addClass("search_init");this.value=asInitVals[index];}});}
function fnCreateRangeInput(oTable){th.html(_fnRangeLabelPart(0));var sFromId=oTable.attr("id")+'_range_from_'+i;var from=$('<input type="text" class="number_range_filter" id="'+sFromId+'" rel="'+i+'"/>');th.append(from);th.append(_fnRangeLabelPart(1));var sToId=oTable.attr("id")+'_range_to_'+i;var to=$('<input type="text" class="number_range_filter" id="'+sToId+'" rel="'+i+'"/>');th.append(to);th.append(_fnRangeLabelPart(2));th.wrapInner('<span class="filter_column filter_number_range" />');var index=i;aiCustomSearch_Indexes.push(i);oTable.dataTableExt.afnFiltering.push(function(oSettings,aData,iDataIndex){if(oTable.attr("id")!=oSettings.sTableId)
return true;if(document.getElementById(sFromId)==null)
return true;var iMin=document.getElementById(sFromId).value*1;var iMax=document.getElementById(sToId).value*1;var iValue=aData[_fnColumnIndex(index)]=="-"?0:aData[_fnColumnIndex(index)]*1;if(iMin==""&&iMax==""){return true;}
else if(iMin==""&&iValue<=iMax){return true;}
else if(iMin<=iValue&&""==iMax){return true;}
else if(iMin<=iValue&&iValue<=iMax){return true;}
return false;});$('#'+sFromId+',#'+sToId,th).keyup(function(){var iMin=document.getElementById(sFromId).value*1;var iMax=document.getElementById(sToId).value*1;if(iMin!=0&&iMax!=0&&iMin>iMax)
return;oTable.fnDraw();fnOnFiltered();});}
function fnCreateDateRangeInput(oTable){var aoFragments=sRangeFormat.split(/[}{]/);th.html("");var sFromId=oTable.attr("id")+'_range_from_'+i;var from=$('<input type="text" placeholder="From" class="date_range_filter" style="margin-bottom:2px;" id="'+sFromId+'" rel="'+i+'"/>');from.datepicker();var sToId=oTable.attr("id")+'_range_to_'+i;var to=$('<input type="text" placeholder="To" class="date_range_filter" id="'+sToId+'" rel="'+i+'"/>');for(ti=0;ti<aoFragments.length;ti++){if(aoFragments[ti]==properties.sDateFromToken){th.append(from);}else{if(aoFragments[ti]==properties.sDateToToken){th.append(to);}else{th.append(aoFragments[ti]);}}}
th.wrapInner('<span class="filter_column filter_date_range" />');to.datepicker();var index=i;aiCustomSearch_Indexes.push(i);oTable.dataTableExt.afnFiltering.push(function(oSettings,aData,iDataIndex){if(oTable.attr("id")!=oSettings.sTableId)
return true;var dStartDate=from.datepicker("getDate");var dEndDate=to.datepicker("getDate");if(dStartDate==null&&dEndDate==null){return true;}
var dCellDate=null;try{if(aData[_fnColumnIndex(index)]==null||aData[_fnColumnIndex(index)]=="")
return false;dCellDate=$.datepicker.parseDate(from.datepicker("option","dateFormat"),aData[_fnColumnIndex(index)]);}catch(ex){console.log(ex);return false;}
if(dCellDate==null)
return false;if(dStartDate==null&&dCellDate<=dEndDate){return true;}
else if(dStartDate<=dCellDate&&dEndDate==null){return true;}
else if(dStartDate<=dCellDate&&dCellDate<=dEndDate){return true;}
return false;});$('#'+sFromId+',#'+sToId,th).change(function(){oTable.fnDraw();fnOnFiltered();});}
function fnCreateColumnSelect(oTable,aData,iColumn,nTh,sLabel,bRegex,oSelected,bCaseSensitive){bCaseSensitive=(typeof bCaseSensitive!=='undefined')?!bCaseSensitive:true;if(aData==null)
aData=_fnGetColumnValues(oTable.fnSettings(),iColumn,true,false,true);var index=iColumn;var currentFilter=oTable.fnSettings().aoPreSearchCols[i].sSearch;if(currentFilter==null||currentFilter=="")
currentFilter=oSelected;var r='<select class="search_init select_filter"><option value="" class="search_init">'+sLabel+'</option>';var j=0;var iLen=aData.length;for(j=0;j<iLen;j++){if(typeof(aData[j])!='object'){var selected='';if(escape(aData[j])==currentFilter||escape(aData[j])==escape(currentFilter))
selected='selected '
r+='<option '+selected+' value="'+escape(aData[j])+'">'+aData[j]+'</option>';}
else{var selected='';if(bRegex){if(aData[j].value==currentFilter)selected='selected ';r+='<option '+selected+'value="'+aData[j].value+'">'+aData[j].label+'</option>';}else{if(escape(aData[j].value)==currentFilter)selected='selected ';r+='<option '+selected+'value="'+escape(aData[j].value)+'">'+aData[j].label+'</option>';}}}
var select=$(r+'</select>');nTh.html(select);nTh.wrapInner('<span class="filter_column filter_select" />');select.change(function(){if($(this).val()!=""){$(this).removeClass("search_init");}else{$(this).addClass("search_init");}
if(bRegex)
oTable.fnFilter($(this).val(),iColumn,bRegex,true,true,bCaseSensitive);else
oTable.fnFilter(unescape($(this).val()),iColumn,bRegex,true,true,bCaseSensitive);fnOnFiltered();});if(currentFilter!=null&&currentFilter!="")
oTable.fnFilter(unescape(currentFilter),iColumn);}
function fnCreateSelect(oTable,aData,bRegex,oSelected,bCaseSensitive){var oSettings=oTable.fnSettings();if(aData==null&&oSettings.sAjaxSource!=""&&!oSettings.oFeatures.bServerSide){oSettings.aoDrawCallback.push({"fn":(function(iColumn,nTh,sLabel){return function(){if(oSettings.iDraw==2&&oSettings.sAjaxSource!=null&&oSettings.sAjaxSource!=""&&!oSettings.oFeatures.bServerSide){return fnCreateColumnSelect(oTable,null,_fnColumnIndex(iColumn),nTh,sLabel,bRegex,oSelected);}};})(i,th,label),"sName":"column_filter_"+i});}
fnCreateColumnSelect(oTable,aData,_fnColumnIndex(i),th,label,bRegex,oSelected,bCaseSensitive);}
function fnCreateCheckbox(oTable,aData){if(aData==null)
aData=_fnGetColumnValues(oTable.fnSettings(),i,true,true,true);var index=i;var r='',j,iLen=aData.length;var localLabel=label.replace('%','Perc').replace("&","AND").replace("$","DOL").replace("??","STERL").replace("@","AT").replace(/\s/g,"_");localLabel=localLabel.replace(/[^a-zA-Z 0-9]+/g,'');var labelBtn=label;if(properties.sFilterButtonText!=null||properties.sFilterButtonText!=undefined){labelBtn=properties.sFilterButtonText;}
var relativeDivWidthToggleSize=10;var numRow=12;var numCol=Math.floor(iLen/numRow);if(iLen%numRow>0){numCol=numCol+1;};var divWidth=100/numCol-2;var divWidthToggle=relativeDivWidthToggleSize*numCol;if(numCol==1){divWidth=20;}
var divRowDef='<div style="float:left; min-width: '+divWidth+'%; " >';var divClose='</div>';var uniqueId=oTable.attr("id")+localLabel;var buttonId="chkBtnOpen"+uniqueId;var checkToggleDiv=uniqueId+"-flt-toggle";r+='<button id="'+buttonId+'" class="checkbox_filter" > '+labelBtn+'</button>';r+='<div id="'+checkToggleDiv+'" '+'title="'+label+'" '+'class="toggle-check ui-widget-content ui-corner-all"  style="width: '+(divWidthToggle)+'%; " >';r+=divRowDef;for(j=0;j<iLen;j++){if(j%numRow==0&&j!=0){r+=divClose+divRowDef;}
r+='<input class="search_init checkbox_filter" type="checkbox" id= "'+aData[j]+'" name= "'+localLabel+'" value="'+aData[j]+'" >'+aData[j]+'<br/>';var checkbox=$(r);th.html(checkbox);th.wrapInner('<span class="filter_column filter_checkbox" />');checkbox.change(function(){var search='';var or='|';var resSize=$('input:checkbox[name="'+localLabel+'"]:checked').size();$('input:checkbox[name="'+localLabel+'"]:checked').each(function(index){if((index==0&&resSize==1)||(index!=0&&index==resSize-1)){or='';}
search=search.replace(/^\s+|\s+$/g,"");search=search+$(this).val()+or;or='|';});for(var jj=0;jj<iLen;jj++){if(search!=""){$('#'+aData[jj]).removeClass("search_init");}else{$('#'+aData[jj]).addClass("search_init");}}
oTable.fnFilter(search,index,true,false);fnOnFiltered();});}
$('#'+buttonId).button();$('#'+checkToggleDiv).dialog({autoOpen:false,hide:"blind",buttons:[{text:"Reset",click:function(){$('input:checkbox[name="'+localLabel+'"]:checked').each(function(index3){$(this).attr('checked',false);$(this).addClass("search_init");});oTable.fnFilter('',index,true,false);fnOnFiltered();return false;}},{text:"Close",click:function(){$(this).dialog("close");}}]});$('#'+buttonId).click(function(){$('#'+checkToggleDiv).dialog('open');var target=$(this);$('#'+checkToggleDiv).dialog("widget").position({my:'top',at:'bottom',of:target});return false;});var fnOnFilteredCurrent=fnOnFiltered;fnOnFiltered=function(){var target=$('#'+buttonId);$('#'+checkToggleDiv).dialog("widget").position({my:'top',at:'bottom',of:target});fnOnFilteredCurrent();};}
function _fnRangeLabelPart(iPlace){switch(iPlace){case 0:return sRangeFormat.substring(0,sRangeFormat.indexOf("{from}"));case 1:return sRangeFormat.substring(sRangeFormat.indexOf("{from}")+6,sRangeFormat.indexOf("{to}"));default:return sRangeFormat.substring(sRangeFormat.indexOf("{to}")+4);}}
var oTable=this;var defaults={sPlaceHolder:"foot",sRangeSeparator:"~",iFilteringDelay:500,aoColumns:null,sRangeFormat:"From {from} to {to}",sDateFromToken:"from",sDateToToken:"to"};var properties=$.extend(defaults,options);return this.each(function(){if(!oTable.fnSettings().oFeatures.bFilter)
return;asInitVals=new Array();var aoFilterCells=oTable.fnSettings().aoFooter[0];var oHost=oTable.fnSettings().nTFoot;var sFilterRow="tr";if(properties.sPlaceHolder=="head:after"){var tr=$("tr:first",oTable.fnSettings().nTHead).detach();if(oTable.fnSettings().bSortCellsTop){tr.prependTo($(oTable.fnSettings().nTHead));aoFilterCells=oTable.fnSettings().aoHeader[1];}
else{tr.appendTo($(oTable.fnSettings().nTHead));aoFilterCells=oTable.fnSettings().aoHeader[0];}
sFilterRow="tr:last";oHost=oTable.fnSettings().nTHead;}else if(properties.sPlaceHolder=="head:before"){if(oTable.fnSettings().bSortCellsTop){var tr=$("tr:first",oTable.fnSettings().nTHead).detach();tr.appendTo($(oTable.fnSettings().nTHead));aoFilterCells=oTable.fnSettings().aoHeader[1];}else{aoFilterCells=oTable.fnSettings().aoHeader[0];}
sFilterRow="tr:first";oHost=oTable.fnSettings().nTHead;}
$(aoFilterCells).each(function(index){i=index;var aoColumn={type:"text",bRegex:false,bSmart:true,iMaxLenght:-1,iFilterLength:0};if(properties.aoColumns!=null){if(properties.aoColumns.length<i||properties.aoColumns[i]==null)
return;aoColumn=properties.aoColumns[i];}
label=$($(this)[0].cell).text();if(aoColumn.sSelector==null){th=$($(this)[0].cell);}
else{th=$(aoColumn.sSelector);if(th.length==0)
th=$($(this)[0].cell);}
if(aoColumn!=null){if(aoColumn.sRangeFormat!=null)
sRangeFormat=aoColumn.sRangeFormat;else
sRangeFormat=properties.sRangeFormat;switch(aoColumn.type){case"null":break;case"number":fnCreateInput(oTable,true,false,true,aoColumn.iFilterLength,aoColumn.iMaxLenght);break;case"select":if(aoColumn.bRegex!=true)
aoColumn.bRegex=false;fnCreateSelect(oTable,aoColumn.values,aoColumn.bRegex,aoColumn.selected,aoColumn.bCaseSensitive);break;case"number-range":fnCreateRangeInput(oTable);break;case"date-range":fnCreateDateRangeInput(oTable);break;case"checkbox":fnCreateCheckbox(oTable,aoColumn.values);break;case"text":default:bRegex=(aoColumn.bRegex==null?false:aoColumn.bRegex);bSmart=(aoColumn.bSmart==null?false:aoColumn.bSmart);fnCreateInput(oTable,bRegex,bSmart,false,aoColumn.iFilterLength,aoColumn.iMaxLenght);break;}}});for(j=0;j<aiCustomSearch_Indexes.length;j++){var fnSearch_=function(){var id=oTable.attr("id");return $("#"+id+"_range_from_"+aiCustomSearch_Indexes[j]).val()+properties.sRangeSeparator+$("#"+id+"_range_to_"+aiCustomSearch_Indexes[j]).val()}
afnSearch_.push(fnSearch_);}
if(oTable.fnSettings().oFeatures.bServerSide){var fnServerDataOriginal=oTable.fnSettings().fnServerData;oTable.fnSettings().fnServerData=function(sSource,aoData,fnCallback){for(j=0;j<aiCustomSearch_Indexes.length;j++){var index=aiCustomSearch_Indexes[j];for(k=0;k<aoData.length;k++){if(aoData[k].name=="sSearch_"+index)
aoData[k].value=afnSearch_[j]();}}
aoData.push({"name":"sRangeSeparator","value":properties.sRangeSeparator});if(fnServerDataOriginal!=null){try{fnServerDataOriginal(sSource,aoData,fnCallback,oTable.fnSettings());}catch(ex){fnServerDataOriginal(sSource,aoData,fnCallback);}}
else{$.getJSON(sSource,aoData,function(json){fnCallback(json)});}};}});};})(jQuery);