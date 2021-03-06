/*******************************************************************************
 * (c) Copyright 2019 Micro Focus or one of its affiliates. 
 * 
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * https://opensource.org/licenses/MIT
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
// to refresh the SSC applications list
function refreshProjectNames(url)
{
	var parameters = {};
	
    var spinner = document.getElementById('refreshSpinner');
    spinner.style.display="block";
    var buttonName = document.getElementById('refreshPrjButton');
    buttonName.disabled=true;
    var buttonVer = document.getElementById('refreshPrjVerButton');
    buttonVer.disabled=true;
    
    new Ajax.Request(url, {
        parameters: parameters,
        onComplete: function(rsp) {
            spinner.style.display="none";
            var jsr = tryParseJSON(rsp.responseText);
            if (!jsr) {
                return;
            }
            var select = document.getElementById('projectName');
            var oldSelect = select.value;
            if (select) {
                var items = new Array();
            	var selectedIndex = 0;
          		// add new values
            	for(var i=0; i<jsr.list.length; i++) {
                	var item = jsr.list[i];
            		items.push(item.name);
          	    	if (oldSelect==item.name) {
          	    		selectedIndex = items.length-1;
          	    	}
            	}
            	updateComboBox(select.comboBox, items, selectedIndex);
            }
            
            buttonName.disabled=false;
            buttonVer.disabled=false;
        }
    });
}

function tryParseJSON(jsonString){
    try {
        // this is better than using eval(), provides some escaping, see Bug 55768
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    } catch (e) {
        // ignore
    }
    return false;
};

//to refresh the SSC application version list
function refreshProjectVersions(url)
{
	var parameters = {};
	
    //var spinner = document.getElementById('refreshSpinner');
    //spinner.style.display="block";
    //var buttonName = document.getElementById('refreshPrjButton');
    //buttonName.disabled=true;
    var buttonVer = document.getElementById('refreshPrjVerButton');
    buttonVer.disabled=true;
    
    new Ajax.Request(url, {
        parameters: parameters,
        onComplete: function(rsp) {
            //spinner.style.display="none";

            var jsr = tryParseJSON(rsp.responseText);
            if (!jsr) {
                return;
            }
            var select = document.getElementById('projectVersion');
            var selectedPrj = document.getElementById('projectName').value;
            var oldSelect = select.value;
            if (select) {
                var items = new Array();
            	var selectedIndex = 0;
          		// add new values
            	for(var i=0; i<jsr.list.length; i++) {
                	var item = jsr.list[i];
                	if (item.prj==selectedPrj) {
	            		items.push(item.name);
	          	    	if (oldSelect==item.name) {
	          	    		selectedIndex = items.length-1;
	          	    	}
                	}
            	}
            	updateComboBox(select.comboBox, items, selectedIndex);
            }
            
            //buttonName.disabled=false;
            buttonVer.disabled=false;
        }
    });
}

function refreshTemplateList(url,paramList)
{
    var parameters = {};
    paramList.split(',').each(function(name) {
        var p = document.getElementById(name);
        if (p==null) {
            p = document.getElementsByName(name);
            if (p != null) {
                 p = p[0];
            }
        }
        if(p!=null) {
            if(p.type=="checkbox")  parameters[name] = p.checked;
            else                    parameters[name] = p.value;
        }
    });

    var spinner = document.getElementById('refreshSpinner');
    spinner.style.display="block";
    var button = document.getElementById('refreshButton');
    button.disabled=true;
    
    new Ajax.Request(url, {
        parameters: parameters,
        onComplete: function(rsp) {
            spinner.style.display="none";
            var jsr = tryParseJSON(rsp.responseText);
            if (!jsr) {
                return;
            }
            var select = document.getElementById('projectTemplate');
            var oldSelect = select.value;
            if ( select ) {
                var items = new Array();
            	var selectedIndex = 0;
          		// add new values
            	for(var i=0; i<jsr.list.length; i++) {
                	var item = jsr.list[i];
            		items.push(item.name);
          	    	if (oldSelect==item.name) {
          	    		selectedIndex = items.length-1;
          	    	}
            	}
            	updateComboBox(select.comboBox, items, selectedIndex);
            }
        }
    });
    button.disabled=false;
}

function updateComboBox(comboBox, items, selectedIndex) {
    comboBox.field.focus();
    comboBox.field.moveCaretToEnd();
    /*
		Workaround for IE. IE has different from other browsers event queue.
		It leads to incorrect behavior because field.onFocus function is called after setItems and clear the list
		Zero timeout allows to set items after all event handlers like onFocus are executed
	*/
    setTimeout (function() {
		comboBox.setItems(items);
		comboBox.select(selectedIndex);
/*
		tdList = comboBox.field.parentElement.parentElement.parentElement.nextElementSibling.getElementsByTagName("td");
		for (var td = 0; td < tdList.length; td++) {
			divList = tdList[td].getElementsByTagName("div");
			for (var i = 0; i < divList.length; i++) {
				div = divList[i];
				if (div.className == "error") {
					while (div.childNodes.length > 0) {
						div.removeChild(div.childNodes[0]);
					}
				}
			}
		}
*/
	}, 0);
}
