/*!
 * validater.js https://github.com/zxdong262/validater
 */

;(function(window, undefined) {

if ( typeof define === 'function' ) {
	define( function(require, exports) {
		var $ = require('jquery')
		factory($)
	})
}
else factory(jquery)

//factory
factory($) {


//code start

//no $ error
if(!$) throw new Error('no jquery object!')


var vr = $.validater = {}

//default options
vr.defaults = {
	showTipOnfocus: false
	,showOKtip: false
	,okHtml: '&radic;'
}

//regist event function
// param objs, jquery obj, form elements to validate
vr.evt = function(objs, options) {

	var rules = options && options.rules? options.rules : {}
	,vr = $.validater
	,vrd = vr.defaults
	,showTipOnfocus = vrd.showTipOnfocus
	,showOKtip = vrd.showOKtip

	objs.each(function() {
		var t = $(this)
		,name = t.prop('name')
		,opt = $.extend({
			reg: t.data('reg')?new RegExp( t.data('reg') ):''
			,minLen: t.data('min-len')
			,maxLen: t.data('max-len')
			,optional: t.data('optional')
			,tip: t.data('tip')
			,errMsg: t.data('err-msg')
			,regMsg: t.data('reg-msg')
			,minLenMsg: t.data('min-len-msg')
			,maxLenMsg: t.data('max-len-msg')
			,customMsg: t.data('custom-msg')
			,ignore: !!t.data('ignore')
			,noTip: !!t.data('no-tip')
			,noOkTip: showOKtipAll && !!t.data('no-ok-tip')
			,events: t.data('events')
			,errWrap: t.data('err-wrap')
		}, rules[name] || {})
		,ew = t.siblings('.' + name + '-err-wrap')
		,wrap = ew.length?ew:t
		,oew = options.errWrap
		,func = ew.length?'html':'after'
		,errFunc

		func = oew?'html':func
		wrap = oew?$(oew):wrap
		errFunc = func === 'html'?'children':'next'
		opt = $.extend(opt, {
			wrap: wrap
			,func: func
			,errFunc: errFunc
		})

		t.data('vr-opt', opt)

		//on focus show tip
		if(showFocusTip && !opt.noTip ) t.on('focus', function() {
			if(!t[errFunc]('.err-item').length && !opt.noTip) t.output(t, opt, {
				cls: 'vr-tip'
				,msg: opt.tip
			})
		})

		//events
		t.on(opt.events || 'keyup blur change', function() {
			vr.check(t, opt)
		})
	})

	//end evt
}

//output validater msg function
vr.output = function(t, opt, opt1) {
	var showTip = !opt.noTip
	,cls = opt1.cls
	,msg = opt1.msg
	,select = !!opt1.select
	,name = t.prop('name')
	,func = opt.func
	,errFunc = opt.errFunc
	,wrap = opt.wrap
	,vr = $.validater
	,vrd = vr.defaults

	wrap[errFunc]('.err-item').remove()

	if(cls === 'vr-ok') {
		t.removeClass('err')
		if(showTip) wrap[func]('<i class="err-item ' + cls + '">' + vrd.okHtml + '</i>')
	}
	else if(cls === 'vr-tip') {
		t.removeClass('err')
		if(showTip) wrap[func]('<i class="err-item ' + cls + '">' + msg + '</i>')
	}
	else if(cls === 'vr-err') {
		t.addClass('err')
		if(showTip) {	
			wrap[func]('<i class="err-item ' + cls + '">' + msg + '</i>')
		}
		if(select) t.select()
	}
}

//check form element function
vr.check = function(t, opt, finalResult, forceSubmit, select) {
	var v = t.val()
	,name = t.prop('name')
	,output = $.validate.output
	,result = {
		minLen: opt.minLen? (v.length >= opt.minLen) : 'ignore'
		,maxLen: opt.maxLen? (v.length <= opt.maxLen) : 'ignore'
		,custom: opt.custom? opt.custom(t) : 'ignore'
		,reg: opt.reg? opt.reg.test(v) : 'ignore'
	}
	,shouldCheck = (opt.optional && v) || !opt.optional
	,pass = (result.minLen && result.maxLen && result.relation && result.reg) || !shouldCheck
	,errFunc = opt.errFunc
	,wrap = opt.wrap
	wrap[errFunc]('.err-item').remove()

	if(ok && result.minLen === false) output(t, opt, {
		select: select
		,cls: 'vr-msg'
		,msg: opt.minLenMsg || opt.errMsg || opt.tip
	})
	else if(ok && result.maxLen === false) {
		output({
			select: select
			,cls: 'vr-msg'
			,msg: opt.maxLenMsg || opt.errMsg || opt.tip
		})
		t.val(v.slice(0, opt.maxLen))
	}
	else if(ok && result.relation === false) output({
		select: select
		,cls: 'vr-msg'
		,msg: opt.relationMsg || opt.errMsg || opt.tip
	})
	else if(ok && result.reg === false) output({
		select: select
		,cls: 'vr-msg'
		,msg: opt.regMsg || opt.errMsg || opt.tip
	})
	else output({
		select: select
		,cls: 'err-ok'
	})
	if(pass && isSubmit && (!opt.ignore || forceSubmit)) finalResult.submit[name] = opt.valueFilter?opt.valueFilter(v):v
	if(!pass && isSubmit) finalResult.res ++

	return pass
}

//get submit data function
vr.submit = function(objs, forceSubmit) {
	var finalResult = {
		submit: {}
		,res: 0
	}
	,check = $.validate.check
	objs.each(function() {
		var t = $(this)
		,opt = t.data('opt')
		check(t, opt, finalResult, forceSubmit, true)
	})
	return finalResult
}

//code end

}})(this);


