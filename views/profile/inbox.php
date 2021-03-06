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
<body id="messages" class="no-contain">
    <div id="page-wrap">

        <?php include 'seg/top.php' ?>
        <?php include 'seg/alerts.php' ?>
        <?php include 'menu.php' ?>

        <section class="container">
            <button accesskey="n" class="btn btn-default btn-primary" data-toggle="modal" data-target="#compose">New Message</button>
            <button class="btn btn-default pull-right" id="mark-all">Mark All Read</button>
        </section>
      
        <section class="container">
            <h3 data-toggle="collapse" data-target="#inbox-content">Inbox</h3>
            <div id="inbox-content" class="content collapse in">
                <div class="content-dark">

                    <?php if(!empty($this->inbox['read']) || !empty($this->inbox['unread'])): ?>
                    <table id="inbox" class="grid messages">
                        <colgroup>
                            <!-- <col class="c1"> -->
                            <col class="c2">
                            <col class="c3">
                            <col class="c4">
                        </colgroup>
                        <tbody>

                            <?php foreach($this->inbox['unread'] as $id => $thread): ?>
                            <tr data-id="<?= $id ?>" class="unread">
                                <!-- <td class="selector"><i class="fa fa-circle-o"></i></td> -->
                                <td class="from">
                                    <a href="/profile/messages/<?= $id ?>"><?= Tpl::out($thread['othernick']) ?></a>
                                    <span class="count">(<?= $thread['count'] ?>)</span>
                                </td>
                                <td class="message"><span><?= Tpl::formatTextForDisplay($thread['message']) ?></span></td>
                                <td class="timestamp"><?= Tpl::calendar(Date::getDateTime($thread['timestamp'])); ?></td>
                            </tr>
                            <?php endforeach; ?>

                            <?php foreach($this->inbox['read'] as $id => $thread): ?>
                            <tr data-id="<?= $id ?>" class="read">
                                <!-- <td class="selector"><i class="fa fa-circle-o"></i></td> -->
                                <td class="from">
                                    <a href="/profile/messages/<?= $id ?>">
                                        <?= Tpl::out($thread['othernick']) ?>
                                    </a>
                                    <span class="count">(<?= $thread['count'] ?>)</span>
                                </td>
                                <td class="message"><span><?= Tpl::formatTextForDisplay($thread['message']) ?></span></td>
                                <td class="timestamp"><?= Tpl::calendar(Date::getDateTime($thread['timestamp'])); ?></td>
                            </tr>
                            <?php endforeach; ?>

                        </tbody>
                    </table>
                    <?php endif ?>

                    <?php if(empty($this->inbox['read']) && empty($this->inbox['unread'])): ?>
                    <table id="inbox" class="grid messages">
                        <tbody>
                        <tr>
                            <td>You have no messages</td>
                        </tr>
                        </tbody>
                    </table>
                    <?php endif ?>

                </div>
            </div>
        </section>
      
    </div>
  
    <?php include 'compose.php' ?>
    <?php include 'seg/foot.php' ?>
    <?php include 'seg/commonbottom.php' ?>
    <script src="<?=Config::cdnv()?>/web.js"></script>

</body>
</html>