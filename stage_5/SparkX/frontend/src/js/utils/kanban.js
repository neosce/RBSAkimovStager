import * as webix from 'webix';

export default function kanbanUI() {
    !function (t, e) {
        "object" == typeof exports && "undefined" != typeof module ? e() : "function" == typeof define && define.amd ? define(e) : e()
    }(0, function () {
        "use strict";

        function o(t) {
            return (o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }

        webix.protoUI({
            name: "kanbanheader", $kanban: !0, $skin: function () {
                this.defaults.height = webix.skin.$active.barHeight, this._template_types.sub.height = webix.skin.$active.barHeight - 12
            }, $init: function (t) {
                var e = this._template_types[t.type];
                e && webix.extend(t, e)
            }, defaults: {
                css: "webix_kanban_header", borderless: !0, template: function () {
                    var t = this.icon || (this.link ? "webix_kanban_icon kbi-plus-circle" : "");
                    return (t ? "<span class='webix_icon " + (this.link ? "webix_kanban_add_icon " : "") + t + "'></span>" : "") + "<span class='webix_strong' style='line-height:" + this.height + "px'>" + (this.label || "") + "</span>"
                }
            }, _template_types: {sub: {css: "webix_kanban_sub_header"}}, on_click: {
                webix_kanban_add_icon: function () {
                    var t = {text: ""}, e = this.getKanban(), i = e.queryView({id: this.config.link});
                    i && this.callEvent("onBeforeCardAdd", [t, i]) && (e.setListStatus(t, i), e.add(t))
                }
            }, getKanban: function () {
                return webix.$$(this.config.master)
            }
        }, webix.MouseEvents, webix.ui.template);
        var e = {jpg: !0, jpeg: !0, png: !0, gif: !0}, i = {
            ppt: "-powerpoint",
            pptx: "-powerpoint",
            pptm: "-powerpoint",
            pps: "-powerpoint",
            ppsx: "-powerpoint",
            ppsm: "-powerpoint",
            doc: "-word",
            docx: "-word",
            docm: "-word",
            xls: "-excel",
            xlsx: "-excel",
            xlsm: "-excel",
            xlsb: "-excel",
            pdf: "-pdf",
            wav: "-audio",
            aif: "-audio",
            mp3: "-audio",
            mid: "-audio",
            mpg: "-video",
            mov: "-video",
            wmv: "-video",
            avi: "-video",
            mp4: "-video",
            zip: "-archive",
            jar: "-archive",
            rar: "-archive",
            gz: "-archive",
            jpg: "-image",
            jpeg: "-image",
            png: "-image",
            gif: "-image"
        };

        function n(t) {
            return e[t.toString().toLowerCase()]
        }

        var t = {
            height: "auto",
            icons: [{
                id: "attachments", icon: "webix_kanban_icon kbi-file", show: function (t) {
                    return !!t.attachments && t.attachments.length
                }, template: "#attachments.length#"
            }, {
                id: "comments", icon: "webix_kanban_icon kbi-comment", show: function (t, e) {
                    return !!e.config.comments
                }, template: function (t) {
                    return t.comments && t.comments.length || ""
                }
            }, {
                id: "editor", icon: "webix_kanban_icon kbi-pencil", show: function (t, e) {
                    return e.config.editor && !e.config.cardActions
                }
            }, {
                id: "menu", icon: "webix_kanban_icon kbi-cogs", show: function (t, e) {
                    return !!e.config.cardActions
                }
            }],
            templateTags: function (t, e, i) {
                var n = [];
                if (t.tags) for (var a = i._tags, s = 0; s < t.tags.length; s++) {
                    var o = t.tags[s];
                    a.exists(o) && (o = a.getItem(o).value), n.push("<span class='webix_kanban_tag'>" + o + "</span>")
                }
                return "<div  class='webix_kanban_tags'>" + (n.length ? n.join("") : "&nbsp;") + "</div>"
            },
            templateIcons: function (t, e, i) {
                for (var n = [], a = null, s = "", o = 0; o < e.icons.length; o++) (a = e.icons[o]).show && !a.show(t, i) || (s = "<span webix_icon_id='" + (a.id || a.icon || a) + "' class='webix_kanban_footer_icon' title='" + (a.tooltip || "") + "'>", s += "<span class='" + (a.icon || a) + " webix_icon'></span>", a.template && (s += "<span class='webix_kanban_icon_text'>" + webix.template(a.template)(t) + "</span>"), s += "</span>", n.push(s));
                return "<div  class='webix_kanban_footer_icons'>" + n.join(" ") + "</div>"
            },
            templateAvatar: function (t, e, i) {
                var n = i._users, a = t.user_id && n.exists(t.user_id) ? n.getItem(t.user_id) : {};
                return a.image ? "<img class='webix_kanban_avatar' src='" + a.image + "' title='" + (a.value || "") + "'>" : "<span class='webix_icon webix_kanban_icon kbi-account' title='" + (a.value || "") + "'></span>"
            },
            templateBody: function (t) {
                return t.text
            },
            templateAttachments: function (t) {
                if (t.attachments) for (var e in t.attachments) {
                    var i = t.attachments[e];
                    if (n(i.link.split(".").pop())) return "<img class='webix_kanban_attachment' src='" + i.link + "'/>"
                }
                return ""
            },
            templateFooter: function (t, e, i) {
                var n = e.templateTags(t, e, i);
                return (n || "&nbsp;") + e.templateIcons(t, e, i)
            },
            templateStart: webix.template("<div webix_l_id='#id#' class='{common.classname()} webix_kanban_list_item' style='width:{common.width}px; height:{common.height}px;'>"),
            template: function (t, e) {
                var i = webix.$$(e.master), n = i._colors.exists(t.color) ? i._colors.getItem(t.color).color : t.color,
                    a = "<div class='webix_kanban_user_avatar' webix_icon_id='$avatar'>" + e.templateAvatar(t, e, i) + "</div>",
                    s = "<div class='webix_kanban_body'>" + e.templateBody(t, e, i) + a + "</div>";
                return "<div class='webix_kanban_list_content'" + (n ? " style='border-left-color:" + n + "'" : "") + ">" + (i.config.attachments ? e.templateAttachments(t, e, i) : "") + s + ("<div class='webix_kanban_footer'>" + e.templateFooter(t, e, i) + "</div>") + "</div>"
            }
        };
        webix.KanbanView = {
            $kanban: !0, on_context: {}, $skin: function () {
            }, getKanban: function () {
                return webix.$$(this.config.master)
            }, _kanban_event: function (t, n, a) {
                this.attachEvent(t, function () {
                    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
                    return (e[a] = this).getKanban().callEvent(n, e)
                })
            }, _fixOrder: function () {
                this.data.each(function (t, e) {
                    return t.$index = e + 1
                })
            }, move: function (t, e, i, n) {
                if (i = i || this, n = n || {}, webix.isArray(t)) return webix.DataMove.move.call(this, t, e, i, n);
                var a = i !== this, s = this.getKanban(), o = s.getItem(t), r = webix.dp.$$(s.config.id);
                if (a) {
                    if (!s.callEvent("onBeforeStatusChange", [t, i.config.status, i])) return;
                    s.setListStatus(o, i), r ? r.ignore(function () {
                        return s.updateItem(t)
                    }) : s.updateItem(t)
                }
                if (webix.DataMove.move.call(i, t, e), this._fixOrder(), this !== i && i._fixOrder(), r) {
                    var c = webix.copy(o);
                    c.webix_move_index = e, c.webix_move_id = i.data.order[e + 1], c.webix_move_parent = i.config.serverStatus || i.config.status, r.save(t, "update", c)
                }
                return a && s.callEvent("onAfterStatusChange", [t, i.config.status, i]), t
            }, _setHandlers: function () {
                this.attachEvent("onAfterSelect", function () {
                    this.eachOtherList(function (t) {
                        t.unselect()
                    })
                }), this._kanban_event("onBeforeSelect", "onListBeforeSelect", 2), this._kanban_event("onAfterSelect", "onListAfterSelect", 1), this._kanban_event("onBeforeContextMenu", "onListBeforeContextMenu", 3), this._kanban_event("onAfterContextMenu", "onListAfterContextMenu", 3), this._kanban_event("onItemClick", "onListItemClick", 3), this._kanban_event("onItemDblClick", "onListItemDblClick", 3), this._kanban_event("onBeforeDrag", "onListBeforeDrag", 2), this._kanban_event("onBeforeDrop", "onListBeforeDrop", 2), this._kanban_event("onAfterDrop", "onListAfterDrop", 2), this._kanban_event("onBeforeDragIn", "onListBeforeDragIn", 2), this._kanban_event("onDragOut", "onListDragOut", 2), this.on_click.webix_kanban_user_avatar = this._handle_icons, this.on_click.webix_kanban_footer_icon = this._handle_icons
            }, _handle_icons: function (t, e, i) {
                var n = i.getAttribute("webix_icon_id"), a = this.type.icons;
                if (a) for (var s = 0; s < a.length; s++) "object" === o(a[s]) && (a[s].id || a[s].icon) === n && a[s].click && a[s].click.call(this, e, t, i, this);
                "$avatar" === n ? this.getKanban().callEvent("onAvatarClick", [e, t, i, this]) : this.getKanban().callEvent("onListIconClick", [n, e, t, i, this])
            }, $dragCreate: function (t, e) {
                var i = webix.DragControl.$drag(t, e);
                if (!i) return !1;
                var n = document.createElement("DIV");
                return n.innerHTML = i, n.className = "webix_drag_zone webix_kanban_drag_zone", document.body.appendChild(n), n
            }, $dropHTML: function () {
                return "<div class='webix_kanban_drop_inner'></div>"
            }, eachOtherList: function (e) {
                var i = this.config.id;
                this.getKanban().eachList(function (t) {
                    t.config.id != i && e.call(webix.$$(i), t)
                })
            }, defaults: {drag: "move", select: !0}
        }, webix.protoUI({
            name: "kanbanlist", $init: function () {
                this.$view.className += " webix_kanban_list", this.$ready.push(webix.bind(this._setHandlers, this))
            }, defaults: {scroll: "auto"}, type: t
        }, webix.ui.list, webix.KanbanView);
        var a = webix.copy(t);
        a.width = 200, webix.protoUI({
            name: "kanbandataview", $init: function () {
                this.$view.className += " webix_kanban_list", this.$ready.push(webix.bind(this._setHandlers, this))
            }, defaults: {prerender: !0}, type: a
        }, webix.ui.dataview, webix.KanbanView), webix.protoUI({
            name: "kanbanuploader", $init: function () {
                var i = this;
                this.files.data.scheme({
                    $init: function (t) {
                        "string" == typeof t.link && t.link && (t.name = t.name || t.link.split("/").pop(), t.type = t.type || t.name.split(".").pop(), t.status = t.states || "server"), t.sizetext = t.sizetext || i._format_size(t.size)
                    }
                }), this.files.data.attachEvent("onStoreUpdated", function () {
                    var t = webix.$$(i.config.link),
                        e = "<span class='webix_strong'>" + (webix.i18n.kanban.dnd || "") + "</span>";
                    i.files.data.count() ? t.hideOverlay() : t.showOverlay(e)
                })
            }, defaults: {
                icon: "webix_kanban_icon kbi-upload"
            }, getValue: function () {
                var e = [];
                return this.files.data.each(function (t) {
                    "server" === t.status && e.push({id: t.id, link: t.link, size: t.size})
                }), e
            }, _format_size: function (t) {
                for (var e = 0; 1024 < t;) e++, t /= 1024;
                return Math.round(100 * t) / 100 + " " + webix.i18n.fileSize[e]
            }
        }, webix.ui.uploader), webix.type(webix.ui.dataview, {
            name: "uploader", height: 91, width: 161, template: function (t, e) {
                return "<a".concat("server" === t.status ? ' href="'.concat(t.link, '" download="').concat(t.name, '"') : "", "></a>\n\t\t\t\t").concat(e.body(t), "\n\t\t\t\t").concat(e.title(t, e), "\n\t\t\t\t").concat(e.removeIcon(t))
            }, body: function (t) {
                return "server" === t.status && n(t.type) ? '<div class="webix_kanban_uploader_body"><img src="'.concat(t.link, '"></div>') : "<div class='webix_kanban_uploader_body'>\n\t\t\t\t\t<span class='webix_icon webix_kanban_icon kbi-file".concat(function e(t) {
                    return i[t.toString().toLowerCase()] || ""
                }(t.type), "'></span>\n\t\t\t\t</div>")
            }, title: function (t, e) {
                return '<div class="webix_kanban_uploader_title" title="'.concat(t.name, '">\n\t\t\t\t\t').concat(e.progress(t), '\n\t\t\t\t\t<div class="webix_kanban_uploader_label">').concat(t.name, "</div>\n\t\t\t\t</div>")
            }, progress: function (t) {
                switch (t.status) {
                    case"client":
                        return "<span class='webix_kanban_uploader_progress'>" + t.sizetext + "</span>";
                    case"transfer":
                        return "<span class='webix_kanban_uploader_progress'>" + t.percent + "%</span>";
                    case"server":
                        return "<span class='webix_kanban_uploader_progress_server'>" + t.sizetext + "</span>";
                    default:
                        return "<span class='webix_kanban_uploader_progress_error'>ERROR</span>"
                }
            }, removeIcon: function () {
                return "<div class='webix_kanban_remove_upload'><span class='webix_icon wxi-close'></span></div>"
            }, on_click: {
                webix_kanban_remove_upload: function (t, e) {
                    return webix.$$(this.config.uploader).files.remove(e), webix.html.preventEvent(t)
                }
            }
        });

        function s(t, e) {
            var i = e.config.status;
            if ("object" === o(i)) for (var n in i) t[n] = i[n]; else "function" == typeof i ? i.call(e, t, !0) : t.status = i
        }

        function r(e) {
            var i = e.config.status;
            return "object" === o(i) ? function (t) {
                for (var e in i) if (t[e] != i[e]) return !1;
                return !0
            } : "function" == typeof i ? function (t) {
                return i.call(e, t)
            } : function (t) {
                return t.status === i
            }
        }

        webix.i18n.kanban = {
            copy: "Copy",
            dnd: "Drop Files Here",
            remove: "Remove",
            save: "Save",
            confirm: "The card will be deleted permanently, are you sure?",
            editor: {
                add: "Add card",
                assign: "Assign to",
                attachments: "Attachments",
                color: "Color",
                edit: "Edit card",
                status: "Status",
                tags: "Tags",
                text: "Text",
                upload: "Upload"
            },
            menu: {copy: "Copy", edit: "Edit", remove: "Remove"}
        }, webix.protoUI({
            name: "kanbaneditor",
            defaults: {width: 534, position: "center", css: "webix_kanban_editor", modal: !0, move: !0},
            $init: function (t) {
                var i = this, e = webix.$$(t.master);
                t.head = {
                    view: "toolbar",
                    paddingX: 17,
                    paddingY: 8,
                    elements: [{
                        view: "label",
                        label: webix.i18n.kanban.editor.add,
                        localId: "$kanban_header"
                    }, {
                        view: "icon", icon: "wxi-close", click: function () {
                            return i._close()
                        }
                    }]
                };
                var n = e.config.editor,
                    a = {view: "form", borderless: !0, padding: 0, elementsConfig: {labelPosition: "top"}}, s = [{
                        view: "textarea",
                        label: webix.i18n.kanban.editor.text,
                        name: "text",
                        height: 90
                    }, {
                        view: "multicombo",
                        label: webix.i18n.kanban.editor.tags,
                        name: "tags",
                        options: e._tags,
                        $hide: !0
                    }, {
                        margin: 8,
                        cols: [{
                            view: "combo",
                            label: webix.i18n.kanban.editor.assign,
                            name: "user_id",
                            $hide: !0,
                            options: {body: {data: e._users, yCount: 5}}
                        }, {
                            view: "richselect",
                            label: webix.i18n.kanban.editor.color,
                            name: "color",
                            $hide: !0,
                            options: {
                                body: {
                                    yCount: 5,
                                    data: e._colors,
                                    css: "webix_kanban_colorpicker",
                                    template: "<span class='webix_kanban_color_item' style='background-color: #color#'></span>#value#"
                                }
                            }
                        }, {
                            view: "richselect",
                            label: webix.i18n.kanban.editor.status,
                            name: "$list",
                            options: {body: {data: e._statuses, yCount: 5}}
                        }]
                    }];
                webix.isArray(n) ? a.elements = n : "object" === o(n) ? ((a = webix.extend(a, n, !0)).view = "form", a.elements = a.elements || a.rows || (a.cols ? [{cols: a.cols}] : s), delete a.rows, delete a.cols) : a.elements = s, e.config.attachments && a.elements.push({
                    margin: 0, rows: [{
                        cols: [{view: "label", label: webix.i18n.kanban.editor.attachments}, {
                            view: "kanbanuploader",
                            label: webix.i18n.kanban.editor.upload,
                            upload: e.config.attachments,
                            name: "attachments",
                            autowidth: !0,
                            css: "webix_transparent webix_kanban_uploader",
                            type: "icon"
                        }]
                    }, {
                        view: "dataview",
                        localId: "$kanban_dataview_uploader",
                        yCount: 1,
                        borderless: !0,
                        type: "uploader",
                        css: "webix_kanban_dataview_uploader",
                        on: {
                            onItemDblClick: function (t, e, i) {
                                i.getElementsByTagName("a")[0].click()
                            }
                        }
                    }]
                }), t.body = {
                    paddingX: 17,
                    paddingY: 0,
                    margin: 16,
                    rows: [a, {
                        cols: [{
                            view: "button",
                            label: webix.i18n.kanban.remove,
                            type: "danger",
                            autowidth: !0,
                            hidden: !0,
                            localId: "$kanban_remove",
                            click: function () {
                                var t = i.getValues({hidden: !1}), e = i.getKanban();
                                e.callEvent("onBeforeEditorAction", ["remove", i, t]) && e._removeCard(t.id).then(function () {
                                    return i._close()
                                })
                            }
                        }, {}, {
                            view: "button",
                            label: webix.i18n.kanban.save,
                            type: "form",
                            autowidth: !0,
                            click: function () {
                                var t = i.getValues({hidden: !1}), e = i.getKanban();
                                e.callEvent("onBeforeEditorAction", ["save", i, t]) && (i._fixStatus(t, e), e.exists(t.id) ? (t.$list = e.getItem(t.id).$list, e.updateItem(t.id, t)) : e.add(t), i._close())
                            }
                        }]
                    }, {height: 1}]
                }, this.$ready.push(this._afterInit)
            },
            _afterInit: function () {
                this._form = this.queryView({view: "form"}), this._removeBtn = this.queryView({localId: "$kanban_remove"}), this._header = this.queryView({localId: "$kanban_header"});
                var t = this.queryView({view: "kanbanuploader"});
                if (t) {
                    var e = this.queryView({localId: "$kanban_dataview_uploader"});
                    t.define("link", e.config.id), t.addDropZone(e.$view), webix.extend(e, webix.OverlayBox)
                }
                var i = this.queryView({$hide: !0}, "all");
                i.length && this.attachEvent("onShow", function () {
                    for (var t = 0; t < i.length; t++) i[t].getList().count() ? i[t].show() : i[t].hide()
                })
            },
            _fixStatus: function (t, e) {
                t.$list = Number(t.$list) || 0, e._sublists[t.$list] && e.setListStatus(t, e._sublists[t.$list])
            },
            getForm: function () {
                return this._form
            },
            getKanban: function () {
                return webix.$$(this.config.master)
            },
            setValues: function (t) {
                "object" === o(t) && t || (t = {});
                var e = this.getKanban(), i = e._assignList(t);
                t.$list = t.$list || (-1 !== i ? i : 0), this._prepareEditor(e, t.id), this._form.setValues(t)
            },
            getValues: function (t) {
                return this._form.getValues(t)
            },
            _prepareEditor: function (t, e) {
                e && t.exists(e) ? (this._removeBtn.show(), this._header.define("label", webix.i18n.kanban.editor.edit)) : (this._removeBtn.hide(), this._header.define("label", webix.i18n.kanban.editor.add)), this._header.refresh()
            },
            _close: function () {
                this.hide(), this._form.clear(), this._prepareEditor()
            }
        }, webix.ui.window), webix.protoUI({
            name: "kanbanuserlist",
            defaults: {
                width: 300, layout: "y", scroll: !0, yCount: 4, autoheight: !1, select: !0, template: function (t) {
                    return t.image ? "<img class='webix_kanban_list_avatar' src='" + t.image + "'>" + t.value : "<span class='webix_icon webix_kanban_icon kbi-account webix_kanban_list_avatar'></span>" + t.value
                }
            },
            $init: function () {
                this.$ready.push(function () {
                    var n = this;
                    this.attachEvent("onShow", function () {
                        var t = n.getContext().user_id;
                        t && n.exists(t) ? (n.select(t), n.showItem(t)) : n.unselectAll()
                    }), this.attachEvent("onMenuItemClick", function (t) {
                        var e = n.getKanban(), i = n.getContext().id;
                        e.updateItem(i, {user_id: t})
                    }), this.type.master = this.config.masterId
                })
            },
            getKanban: function () {
                return webix.$$(this.config.masterId)
            }
        }, webix.ui.contextmenu), webix.protoUI({
            name: "kanbanmenu", $init: function () {
                this.$ready.push(function () {
                    this.attachEvent("onItemClick", function (t) {
                        var e = this.getContext().id, i = this.getKanban();
                        if (i.callEvent("onBeforeCardAction", [t, e])) switch (t) {
                            case"edit":
                                i.showEditor(webix.copy(i.getItem(e)));
                                break;
                            case"copy":
                                i.copy(e);
                                break;
                            case"remove":
                                i._removeCard(e)
                        }
                    })
                })
            }, getKanban: function () {
                return webix.$$(this.config.masterId)
            }
        }, webix.ui.contextmenu), webix.protoUI({
            name: "kanbanchat", $init: function (t) {
                t.padding = 0, this.$ready.push(function () {
                    var n = this;
                    this.attachEvent("onHide", this._hide_chat), this.queryView({view: "list"}).data.attachEvent("onStoreUpdated", function (t, e, i) {
                        i && "paint" !== i && n._save()
                    })
                })
            }, _save: function () {
                var t = this.getContext(), e = this.getBody(), i = this.getKanban();
                t && i.exists(t.id) && i.updateItem(t.id, {comments: e.serialize()})
            }, _hide_chat: function () {
                var t = this.getBody();
                t.queryView({view: "form"}).clear(), t.queryView({view: "list"}).clearAll()
            }, getKanban: function () {
                return webix.$$(this.config.masterId)
            }
        }, webix.ui.context), webix.protoUI({
            name: "kanban", defaults: {delimiter: ","}, $skin: function () {
                this.defaults.type = "space"
            }, $init: function (t) {
                var e = this;
                this.$view.className += " webix_kanban", this.data.provideApi(this, !0), this.data.scheme({
                    $change: function (t) {
                        "string" == typeof t.tags && (t.tags = e._strToArr(t.tags))
                    }
                }), this._destroy_with_me = [], this._statuses = new webix.DataCollection, this._destroy_with_me.push(this._statuses), this._tags = this._data_unification(t.tags), this._users = this._data_unification(t.users), this._colors = this._data_unification(t.colors), this.$ready.push(function () {
                    var n = this;
                    this.reconstruct(), this._initEditor(), this._initUserList(), this._initMenu(), this._initComments(), this.data.attachEvent("onStoreUpdated", function (t, e, i) {
                        return n._applyOrder(t, e, i)
                    }), this.data.attachEvent("onIdChange", function (t, e) {
                        n.getOwnerList(t).data.changeId(t, e)
                    }), this.attachEvent("onDestruct", function () {
                        for (var t = 0; t < n._destroy_with_me.length; t++) n._destroy_with_me[t].destructor()
                    })
                }), this.serialize = this._serialize
            }, _strToArr: function (t) {
                return t ? t.split(this.config.delimiter) : []
            }, getTags: function () {
                return this._tags
            }, getUsers: function () {
                return this._users
            }, getColors: function () {
                return this._colors
            }, getStatuses: function () {
                return this._statuses.serialize()
            }, cardActions_setter: function (t) {
                if (!0 === t && (t = ["edit", "copy", "remove"]), webix.isArray(t)) return t.map(function (t) {
                    return {id: t, value: webix.i18n.kanban.menu[t] || t}
                })
            }, showEditor: function (t) {
                var e = this.getEditor();
                this.callEvent("onBeforeEditorShow", [e, t]) && e && (e.setValues(t), e.show(), this.callEvent("onAfterEditorShow", [e, t]))
            }, copy: function (t) {
                if (this.callEvent("onBeforeCopy", [t])) {
                    var e = webix.copy(this.getItem(t));
                    delete e.id, e.text = webix.i18n.kanban.copy + " " + (e.text || "");
                    var i = this.add(e), n = this.getOwnerList(i);
                    n.move(i, n.getIndexById(t) + 1, n), this.callEvent("onAfterCopy", [t])
                }
            }, _removeCard: function (e) {
                var i = this, n = webix.promise.defer();
                return webix.i18n.kanban.confirm ? webix.confirm({
                    text: webix.i18n.kanban.confirm, callback: function (t) {
                        t && (i.remove(e), n.resolve())
                    }
                }) : (this.remove(e), n.resolve()), n
            }, _data_unification: function (t) {
                if (t && t.getItem) return t;
                var e = new webix.DataCollection;
                return this._destroy_with_me.push(e), t && "string" == typeof t ? e.load(t) : e.parse(t || []), e
            }, getEditor: function () {
                return webix.$$(this._editor)
            }, getUserList: function () {
                return webix.$$(this._userList)
            }, getMenu: function () {
                return webix.$$(this._menu)
            }, getComments: function () {
                return webix.$$(this._comments)
            }, _initEditor: function () {
                var i = this;
                if (this.config.editor) {
                    var t = webix.ui({view: "kanbaneditor", master: this.config.id});
                    this._editor = t.config.id, this._destroy_with_me.push(t), this.attachEvent("onListIconClick", function (t, e) {
                        "editor" === t && i.showEditor(webix.copy(i.getItem(e)))
                    }), this.attachEvent("onListItemDblClick", function (t) {
                        return i.showEditor(webix.copy(i.getItem(t)))
                    })
                }
            }, _initUserList: function () {
                var a = this;
                if (this.config.userList) {
                    var t = "object" === o(this.config.userList) ? this.config.userList : {};
                    webix.extend(t, {
                        view: "kanbanuserlist",
                        masterId: this.config.id,
                        data: this._users
                    }, !0), t = webix.ui(t), this._userList = t.config.id, this._destroy_with_me.push(t), this.attachEvent("onAvatarClick", function (t, e, i) {
                        var n = a.getUserList();
                        n.setContext({id: t, user_id: a.getItem(t).user_id}), n.show(i)
                    })
                }
            }, _initMenu: function () {
                var s = this;
                if (this.config.cardActions) {
                    var t = webix.ui({view: "kanbanmenu", data: this.config.cardActions, masterId: this.config.id});
                    this._menu = t.config.id, this._destroy_with_me.push(t), this.attachEvent("onListIconClick", function (t, e, i, n) {
                        if ("menu" === t) {
                            var a = s.getMenu();
                            a.setContext({id: e}), a.show(n)
                        }
                    })
                }
            }, _initComments: function () {
                var c = this;
                if (this.config.comments) {
                    var t = "object" === o(this.config.comments) ? this.config.comments : {};
                    t = webix.extend({width: 400, height: 400}, t, !0), webix.extend(t, {
                        view: "comments",
                        users: this._users
                    }, !0);
                    var e = webix.ui({view: "kanbanchat", body: t, masterId: this.config.id});
                    this._comments = e.config.id, this._destroy_with_me.push(e), this.attachEvent("onListIconClick", function (t, e, i, n) {
                        if ("comments" === t && c.callEvent("onBeforeCommentsShow", [e, i, n])) {
                            var a = c.getComments(), s = webix.html.offset(n);
                            s.y += s.height, a.hide();
                            var o = a.getBody(), r = c.getItem(e).comments || [];
                            o.parse(webix.copy(r)), a.setContext({
                                id: e
                            }), a.show(s)
                        }
                    })
                }
            }, _serialize: function () {
                var e = [];
                return this.eachList(function (t) {
                    e = e.concat(t.serialize())
                }), e
            }, _applyOrder: function (t, e, i) {
                if (!t) return this._syncData();
                if (-1 !== this.getIndexById(t)) switch (i) {
                    case"add":
                        0 <= this._assignList(e) && (this.getOwnerList(t).add(e), e.$index = this._sublists[e.$list].count());
                        break;
                    case"delete":
                        this._sublists[e.$list] && this._sublists[e.$list].remove(t);
                        break;
                    case"paint":
                    case"update":
                        var n = e.$list, a = this._assignList(e);
                        n === a ? 0 <= a && this.getOwnerList(t).updateItem(t, e) : (this._sublists[n] && this._sublists[n].remove(t), 0 <= a && this.getOwnerList(t).add(e))
                }
            }, setListStatus: function (t, e) {
                for (var i = 0; i < this._sublists.length; i++) if (this._sublists[i] === e) return void s(t, e)
            }, reconstruct: function () {
                this._prepareLists(), this._syncData()
            }, _prepareLists: function () {
                this._sublists = [], this._subfilters = [];
                for (var t = [], e = this.queryView(function (t) {
                    return t.$kanban
                }, "all"), i = 0; i < e.length; i++) {
                    var n = e[i];
                    "kanbanheader" !== n.config.view ? this._sublists.push(n) : n.config.master = this.config.id
                }
                for (var a = 0; a < this._sublists.length; a++) {
                    var s = this._sublists[a];
                    this._subfilters[a] = r(s), this.config.icons && (s.type.icons = s.type.icons || this.config.icons);
                    var o = s.config.name || ("string" == typeof s.config.status && s.config.status ? s.config.status[0].toUpperCase() + s.config.status.slice(1) : s.config.id);
                    t.push({
                        id: a.toString(),
                        value: o
                    }), s.config.master = this.config.id, s.type.master = this.config.id
                }
                this._statuses.clearAll(), this._statuses.parse(t)
            }, _syncData: function () {
                for (var i = [], t = 0; t < this._sublists.length; t++) i[t] = [];
                this.data.each(function (t) {
                    var e = this._assignList(t);
                    0 <= e && i[e].push(t)
                }, this);
                for (var e = 0; e < this._sublists.length; e++) {
                    var n = i[e];
                    1 < n.length && n[0].$index && n.sort(function (t, e) {
                        return t.$index > e.$index ? 1 : -1
                    }), this._sublists[e].clearAll(), this._sublists[e].data.importData(n), this._sublists[e]._fixOrder()
                }
            }, _assignList: function (t) {
                for (var e = 0; e < this._sublists.length; e++) if (this._subfilters[e](t)) return t.$list = e;
                return -1
            }, getSelectedId: function () {
                var e = null;
                return this.eachList(function (t) {
                    e = t.getSelectedId() || e
                }), e
            }, select: function (t) {
                this.getOwnerList(t).select(t)
            }, getOwnerList: function (t) {
                var e = this.getItem(t);
                return e ? this._sublists[e.$list] : null
            }, eachList: function (t) {
                for (var e = 0; e < this._sublists.length; e++) t.call(this, this._sublists[e], this._sublists[e].config.status)
            }
        }, webix.DataLoader, webix.EventSystem, webix.ui.headerlayout)
    });
};
//# sourceMappingURL=kanban.js.map