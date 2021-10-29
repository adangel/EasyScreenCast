/*
  Copyright (c) 2011-2012, Giovanni Campagna <scampa.giovanni@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the GNOME nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* exported ESConGIcon,ESCoffGIcon,ESConGIconSel,ESCoffGIconSel,ESCimgPerformance,ESCimgQuality,ESCimgInfo,TalkativeLog,getSettings,initTranslations */
'use strict';

const Gettext = imports.gettext;
const Gio = imports.gi.Gio;

const Config = imports.misc.config;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;

/**
 * Initialize Gettext to load translations from extensionsdir/locale.
 * If @domain is not provided, it will be taken from metadata['gettext-domain']
 *
 * @param {string} domain (optional): the gettext domain to use
 */
function initTranslations(domain) {
    domain = domain || Me.metadata['gettext-domain'];

    // check if this extension was built with "make zip-file", and thus
    // has the locale files in a subfolder
    // otherwise assume that extension has been installed in the
    // same prefix as gnome-shell
    let localeDir = Me.dir.get_child('locale');
    if (localeDir.query_exists(null)) {
        Gettext.bindtextdomain(domain, localeDir.get_path());
    } else {
        Gettext.bindtextdomain(domain, Config.LOCALEDIR);
    }
}

/**
 * Builds and return a GSettings schema for @schema, using schema files
 * in extensionsdir/schemas. If @schema is not provided, it is taken from
 * metadata['settings-schema'].
 *
 * @param {string} schema (optional): the GSettings schema id
 * @returns {Gio.Settings}
 */
function getSettings(schema) {
    // schema = schema || extension.metadata['settings-schema'];

    const GioSSS = Gio.SettingsSchemaSource;

    // check if this extension was built with "make zip-file", and thus
    // has the schema files in a subfolder
    // otherwise assume that extension has been installed in the
    // same prefix as gnome-shell (and therefore schemas are available
    // in the standard folders)
    let schemaDir = Me.dir.get_child('schemas');
    let schemaSource;
    if (schemaDir.query_exists(null)) {
        schemaSource = GioSSS.new_from_directory(
            schemaDir.get_path(),
            GioSSS.get_default(),
            false
        );
    } else {
        schemaSource = GioSSS.get_default();
    }

    let schemaObj = schemaSource.lookup(schema, true);

    if (!schemaObj) {
        throw new Error(`Schema ${schema} could not be found for extension ${Me.metadata.uuid}. Please check your installation.`);
    }

    return new Gio.Settings({
        settings_schema: schemaObj,
    });
}

/**
 * @param {string} msg the message to log
 * @class
 */
function TalkativeLog(msg) {
    if (Settings.getOption('b', Settings.VERBOSE_DEBUG_SETTING_KEY)) {
        log(`[ESC]${msg}`);
    }
}

var ESConGIcon = new Gio.FileIcon({
    file: Gio.File.new_for_path(
        Me.dir.get_child('images/icon_recording.svg').get_path()
    ),
});

var ESCoffGIcon = new Gio.FileIcon({
    file: Gio.File.new_for_path(
        Me.dir.get_child('images/icon_default.svg').get_path()
    ),
});

var ESConGIconSel = new Gio.FileIcon({
    file: Gio.File.new_for_path(
        Me.dir.get_child('images/icon_recordingSel.svg').get_path()
    ),
});

var ESCoffGIconSel = new Gio.FileIcon({
    file: Gio.File.new_for_path(
        Me.dir.get_child('images/icon_defaultSel.svg').get_path()
    ),
});

var ESCimgPerformance = Me.dir
    .get_child('images/Icon_Performance.svg')
    .get_path();

var ESCimgQuality = Me.dir.get_child('images/Icon_Quality.svg').get_path();

var ESCimgInfo = Me.dir.get_child('images/Icon_Info.png').get_path();
