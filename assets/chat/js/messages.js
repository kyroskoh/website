/* global $ */

import UserFeatures from './features.js';
import moment from 'moment';

const MessageTypes = {
    status    : 'status',
    error     : 'error',
    info      : 'info',
    command   : 'command',
    broadcast : 'broadcast',
    ui        : 'ui',
    chat      : 'chat',
    user      : 'user',
    emote     : 'emote'
};

class MessageBuilder {

    static cssMessage(classes=[]){
        return new ChatUIMessage('', classes)
    }

    static uiMessage(message, classes=[]){
        return new ChatUIMessage(message, classes)
    }

    static statusMessage(message, timestamp = null){
        return new ChatMessage(message, timestamp, MessageTypes.status)
    }

    static errorMessage(message, timestamp = null){
        return new ChatMessage(message, timestamp, MessageTypes.error)
    }

    static infoMessage(message, timestamp = null){
        return new ChatMessage(message, timestamp, MessageTypes.info)
    }

    static broadcastMessage(message, timestamp = null){
        return new ChatMessage(message, timestamp, MessageTypes.broadcast)
    }

    static commandMessage(message, timestamp = null){
        return new ChatMessage(message, timestamp, MessageTypes.command)
    }

    static userMessage(message, user, timestamp = null){
        return new ChatUserMessage(message, user, timestamp)
    }

    static whisperMessage(message, user, target, timestamp = null, id = null){
        const m =  new ChatUserMessage(message, user, timestamp);
        m.id = id;
        m.target = target;
        return m;
    }

    static emoteMessage(emote, timestamp, count=1){
        return new ChatEmoteMessage(emote, timestamp, count);
    }

}

class ChatUIMessage {

    constructor(str, classes=[]){
        this.ui      = null;
        this.chat    = null;
        this.message = str;
        this.type    = MessageTypes.ui;
        this.classes = classes;
    }

    attach(chat){
        this.chat = chat;
        this.ui = $(this.html());
        return this.ui;
    }

    wrap(content, classes=[], attr={}){
        classes.push(this.classes);
        classes.unshift(`msg-${this.type}`);
        attr['class'] = classes.join(' ');
        return $('<div>', attr).html(content)[0].outerHTML;
    }

    html(){
        return this.wrap(this.message);
    }

}

class ChatMessage extends ChatUIMessage {

    constructor(message, timestamp=null, type=MessageTypes.chat){
        super(message);
        this.type = type;
        this.timestamp = (timestamp) ? moment.utc(timestamp).local() : moment();
    }

    wrapTime(){
        const datetime = this.timestamp.format('MMMM Do YYYY, h:mm:ss a');
        const label = this.timestamp.format(this.chat.settings.get('timestampformat'));
        return `<time class="time" title="${datetime}">${label}</time>`;
    }

    wrapMessage(){
        let msg = this.message;
        this.chat.formatters.forEach(f => msg = f.format(msg, this.user, this));
        return `<span class="text">${msg}</span>`;
    }

    html(){
        return this.wrap(this.wrapTime() + ' ' + this.wrapMessage());
    }
}

class ChatUserMessage extends ChatMessage {

    constructor(message, user, timestamp=null) {
        super(message, timestamp, MessageTypes.user);
        this.user = user;
        this.id = null;
        this.highlighted = false;
        this.historical = false;
        this.target = null;
        this.tag = null;
        this.isSlashMe = false;
        this.mentioned = [];
        if (this.message.substring(0, 4) === '/me ') {
            this.isSlashMe = true;
            this.message = this.message.substring(4);
        } else if (this.message.substring(0, 2) === '//') {
            this.message = this.message.substring(1);
        }
    }

    wrapTime(){
        if(this.historical) {
            const datetime = this.timestamp.format('MMMM Do YYYY, h:mm:ss a');
            const label = this.timestamp.fromNow();
            return `<time class="time" title="${datetime}">${label}</time>`;
        }
        return super.wrapTime();
    }

    wrapUser(user){
        const features = (user.features.length > 0) ? this.getFeatureHTML() : '';
        return `${features} <a class="user ${user.features.join(' ')}">${user.username}</a>`;
    }

    html(){
        const classes = [], attr = {};
        const continued = this.chat.lastmessage && this.chat.lastmessage.user && this.user && this.chat.lastmessage.user.username === this.user.username;

        if(this.id !== null)
            attr['data-id'] = this.id;
        if(this.user && this.user.username)
            attr['data-username'] = this.user.username.toLowerCase();
        if(this.chat.user && this.chat.user.username === this.user.username)
            classes.push('msg-own');
        if(this.isSlashMe)
            classes.push('msg-emote');
        if(this.historical)
            classes.push('msg-historical');
        if(this.highlighted)
            classes.push('msg-highlight');
        if(continued && !this.target)
            classes.push('msg-continue');
        if(this.tag)
            classes.push(`msg-tagged msg-tagged-${this.tag}`);
        if(this.target)
            classes.push(`msg-whisper`);
        if(this.mentioned !== null && this.mentioned.length > 0)
            attr['data-mentioned'] = this.mentioned.join(' ').toLowerCase();

        let t = '';
        if(this.target) {
            t = ' whispered you ... '+
                '<span>'+
                    `<a data-username="${this.user.username}" class="chat-open-whisper"><i class="fa fa-envelope" aria-hidden="true"></i> open</a> ` +
                    `<a data-username="${this.user.username}" class="chat-remove-whisper"><i class="fa fa-times" aria-hidden="true"></i> remove</a>`+
                '</span>';
        } else {
            t = continued ? '':':';
        }

        return this.wrap(`${this.wrapTime()} ${this.wrapUser(this.user)}${t} <span class="ctrl"></span> ${this.wrapMessage()}`, classes, attr);
    }

    getFeatureHTML(){
        let icons = '';
        let user = this.user;

        if(user.hasFeature(UserFeatures.SUBSCRIBERT4))
            icons += '<i class="icon-subscribert4" title="Subscriber (T4)"/>';
        else if(user.hasFeature(UserFeatures.SUBSCRIBERT3))
            icons += '<i class="icon-subscribert3" title="Subscriber (T3)"/>';
        else if(user.hasFeature(UserFeatures.SUBSCRIBERT2))
            icons += '<i class="icon-subscribert2" title="Subscriber (T2)"/>';
        else if(user.hasFeature(UserFeatures.SUBSCRIBERT1))
            icons += '<i class="icon-subscriber" title="Subscriber (T1)"/>';
        else if(!user.hasFeature(UserFeatures.SUBSCRIBERT0) && user.hasFeature(UserFeatures.SUBSCRIBER))
            icons += '<i class="icon-subscriber" title="Subscriber (T1)"/>';

        for(const feature of user.features){
            switch(feature){
                case UserFeatures.SUBSCRIBERT0 :
                    icons += '<i class="icon-minitwitch" title="Twitch subscriber"/>';
                    break;
                case UserFeatures.BOT :
                    icons += '<i class="icon-bot" title="Bot"/>';
                    break;
                case UserFeatures.BOT2 :
                    icons += '<i class="icon-bot2" title="Bot"/>';
                    break;
                case UserFeatures.NOTABLE :
                    icons += '<i class="icon-notable" title="Notable"/>';
                    break;
                case UserFeatures.TRUSTED :
                    icons += '<i class="icon-trusted" title="Trusted"/>';
                    break;
                case UserFeatures.CONTRIBUTOR :
                    icons += '<i class="icon-contributor" title="Contributor"/>';
                    break;
                case UserFeatures.COMPCHALLENGE :
                    icons += '<i class="icon-compchallenge" title="Composition Winner"/>';
                    break;
                case UserFeatures.EVE :
                    icons += '<i class="icon-eve" title="Eve"/>';
                    break;
                case UserFeatures.SC2 :
                    icons += '<i class="icon-sc2" title="Starcraft 2"/>';
                    break;
                case UserFeatures.BROADCASTER :
                    icons += '<i class="icon-broadcaster" title="Broadcaster"/>';
                    break;
            }
        }
        return icons.length > 0 ? `<span class="features">${icons}</span>` : '';
    }

}

class ChatEmoteMessage extends ChatMessage {

    constructor(emote, timestamp, count=1){
        super(emote, timestamp, MessageTypes.emote);
        this.emotecount = count;
        this.emotecountui = null;
        this.combocomplete = false;
    }

    wrapMessage(){
        let msg = this.message;
        this.chat.formatters.forEach(f => msg = f.format(msg));
        return `<span class="text">${msg}</span>`;
    }

    getEmoteCountLabel(){
        return `<i class='count'>${this.emotecount}</i> <i class="x">X</i> <i class="hit">Hits</i> <i class='combo'>C-C-C-COMBO</i> <span class="emotecountbg"></span>`;
    }

    html(){
        return this.wrap(`${this.wrapTime()} ${this.wrapMessage()} <span class="emotecount">${this.getEmoteCountLabel()}<span>`);
    }

    incEmoteCount(){
        ++this.emotecount;
        let stepClass = '';
        if(this.emotecount >= 50)
            stepClass = ' x50';
        else if(this.emotecount >= 30)
            stepClass = ' x30';
        else if(this.emotecount >= 20)
            stepClass = ' x20';
        else if(this.emotecount >= 10)
            stepClass = ' x10';
        else if(this.emotecount >= 5)
            stepClass = ' x5';
        if(!this.emotecountui)
            this.emotecountui = this.ui.find('.emotecount');
        this.emotecountui.detach()
            .attr('class', 'emotecount' + stepClass)
            .html(this.getEmoteCountLabel())
            .appendTo(this.ui);
    }

    completeCombo(){
        if(!this.emotecountui)
            this.emotecountui = this.ui.find('.emotecount');
        this.emotecountui.addClass('combo-complete');
        this.combocomplete = true;

    }

}

export {
    MessageBuilder,
    ChatUIMessage,
    ChatMessage,
    ChatUserMessage,
    ChatEmoteMessage,
    MessageTypes
};