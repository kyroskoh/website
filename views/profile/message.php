<?php
namespace Destiny;
use Destiny\Common\Utils\Tpl;
use Destiny\Common\Utils\Date;
use Destiny\Common\Config;
?>
<!DOCTYPE html>
<html>
<head>
<title><?=Tpl::title($this->title)?></title>
<meta charset="utf-8">
<?php include 'seg/commontop.php' ?>
<link href="<?=Config::cdnv()?>/web.css" rel="stylesheet" media="screen">
</head>
<body id="message" class="no-contain">
    <div id="page-wrap">

        <?php include 'seg/top.php' ?>
        <?php include 'seg/alerts.php' ?>
        <?php include 'menu.php' ?>
        
        <section class="container message-list active">

            <h4 class="message-list-title">Messages between you and <?= Tpl::out($this->targetuser['username']) ?></h4>

            <?php for($i=count($this->messages)-1; $i>=0; $i--): ?>
            <?php
                $msg = $this->messages[$i];
                $isme = (stristr($msg['from'], $this->username) !== false);
                $styles = array();
                $styles[] = 'message-active';
                $styles[] = ($isme) ? 'message-me' : 'message-notme';
                $styles[] = ($msg['isread'] == 1) ? 'message-read' : 'message-unread';
            ?>
            <div id="<?= Tpl::out($msg['id']) ?>" class="message <?= join(' ', $styles) ?> content content-dark clearfix">
                <div class="message-content clearfix">
                    <div class="message-header clearfix">
                        <div class="message-from pull-left">
                            <span title="<?= Tpl::out($msg['from']) ?>"><?= (!$isme) ? Tpl::out($msg['from']) : 'Me' ?></span>
                        </div>
                        <?php if ($isme and $msg['isread']): ?>
                            <div class="icon-message-read pull-left glyphicon glyphicon-ok-circle" title="Your message has been marked as read"></div>
                        <?php elseif ($isme and !$msg['isread']): ?>
                            <div class="icon-message-unread pull-left glyphicon glyphicon-question-sign" title="Your message has not yet been read"></div>
                        <?php endif ?>
                        <div class="message-date pull-right"><?= Tpl::calendar(Date::getDateTime($msg['timestamp'])); ?></div>
                    </div>
                    <div class="message-txt"><?= Tpl::formatTextForDisplay($msg['message']) ?></div>
                </div>
                <div class="message-summary clearfix">
                    <span class="message-from">
                        <span title="<?= Tpl::out($msg['from']) ?>"><?= (!$isme) ? Tpl::out($msg['from']) : 'Me' ?></span>
                    </span>
                    <span class="message-snippet"><?= Tpl::formatTextForDisplay($msg['message']) ?></span>
                    <span class="message-date"><?= Tpl::calendar(Date::getDateTime($msg['timestamp'])); ?></span>
                </div>
                <div class="speech-arrow"></div>
            </div>
            <?php endfor; ?>
            <div class="clearfix"></div>
            <div class="message-reply content content-dark clearfix" style="">
                <div class="clearfix">
                    <span class="pull-left">
                        <a accesskey="r" id="reply-toggle" href="#" data-replyto="<?= Tpl::out($this->targetuser['username']) ?>" data-toggle="modal" data-target="#compose"><i class="fa fa-reply-all"></i> Reply</a>
                        to this message or go to <a accesskey="m" href="/profile/messages">inbox</a>.
                    </span>
                </div>
            </div>

        </section>

    </div>

    <?php include 'compose.php' ?>
    <?php include 'seg/foot.php' ?>
    <?php include 'seg/commonbottom.php' ?>
    <script src="<?=Config::cdnv()?>/web.js"></script>
    <script src="<?=Config::cdnv()?>/messages.js"></script>

</body>
</html>