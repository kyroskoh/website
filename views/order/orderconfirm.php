<?php
namespace Destiny;
use Destiny\Common\Utils\Tpl;
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
<body id="orderconfirm" class="no-brand">
  <div id="page-wrap">

    <?php include 'seg/top.php' ?>
    <?php include 'seg/headerband.php' ?>

    <section class="container">

      <h1 class="title">
        <span>Subscribe</span> <small>confirm your selection</small>
      </h1>

      <div class="content content-dark clearfix">

        <?php if(!empty($this->warning)): ?>
        <div style="margin: 15px 15px 0 15px;">
          <div class="alert alert-warning" style="margin: 0;">
            <strong><span class="fa fa-warning"></span> Warning!</strong>
            <?=Tpl::out($this->warning->getMessage())?>
          </div>
        </div>
        <?php endif ?>

        <div class="ui-step-legend-wrap clearfix">
          <div class="ui-step-legend clearfix">
            <ul>
              <li style="width: 25%;"><a>Select a subscription</a></li>
              <li style="width: 25%;" class="active"><a>Confirmation</a><i class="arrow"></i></li>
              <li style="width: 25%;"><a>Pay subscription</a></li>
              <li style="width: 25%;"><a>Complete</a></li>
            </ul>
          </div>
        </div>

        <div style="width: 100%;" class="clearfix stream">
          <form class="onceoff" action="/subscription/create" method="post">

            <input type="hidden" name="subscription" value="<?= $this->subscriptionType['id'] ?>">
            <input type="hidden" name="gift" value="<?= $this->gift ?>">

            <?php if(!empty($this->currentSubscription)): ?>

            <div class="ds-block clearfix">

              <div class="subscriptions pull-left" style="border-right:1px dashed #222; padding-right: 15px; margin-right: 15px;">
                <div class="subscription-tier clearfix">
                  <div class="subscription" style="width: auto;">
                    <div><span class="label label-warning">FROM</span></div>
                    <h2><?=$this->currentSubscriptionType['tierLabel']?></h2>
                    <div><span class="sub-amount">$<?=$this->currentSubscriptionType['amount']?></span> (<?=$this->currentSubscriptionType['billingFrequency']?> <?=strtolower($this->currentSubscriptionType['billingPeriod'])?>)</div>
                  </div>
                </div>
              </div>

              <div class="subscriptions pull-left">
                <div class="subscription-tier clearfix">
                  <div class="subscription" style="width: auto;">
                    <div><span class="label label-success">TO</span></div>
                    <h2><?=$this->subscriptionType['tierLabel']?></h2>
                    <div><span class="sub-amount">$<?=$this->subscriptionType['amount']?></span> (<?=$this->subscriptionType['billingFrequency']?> <?=strtolower($this->subscriptionType['billingPeriod'])?>)</div>
                  </div>
                </div>
              </div>

            </div>

            <?php else: ?>

            <div class="subscription-tier ds-block">
              <div class="subscription">
                <h2><?=$this->subscriptionType['tierLabel']?></h2>

                <?php if(!empty($this->gift)): ?>
                <p><span class="fa fa-gift"></span> You are gifting this to <span class="label label-danger"><?=Tpl::out($this->gift)?></span></p>
                <?php endif ?>

                <p><span class="sub-amount">$<?=$this->subscriptionType['amount']?></span> (<?=$this->subscriptionType['billingFrequency']?> <?=strtolower($this->subscriptionType['billingPeriod'])?>)</p>
              </div>
            </div>

            <?php endif ?>
            <div id="extraMessage" class="ds-block">
              <div>Send a message with your subscription (optional):</div>
              <textarea name="sub-message" autocomplete="off" maxlength="250" rows="5" class="form-control" placeholder=""></textarea>
              <small style="display: none;">Maximum message length 250 characters</small>
            </div>

            <div class="ds-block">
              <div class="checkbox">
                <label for="renew">
                  <div><input id="renew" type="checkbox" name="renew" value="1" /> <strong>Recurring subscription</strong></div>
                  <small>Automatically bill every <?=$this->subscriptionType['billingFrequency']?> <?=strtolower($this->subscriptionType['billingPeriod'])?>(s)</small>
                </label>
              </div>
            </div>

            <div class="form-actions">
              <a class="pull-right powered-paypal" title="Powered by Paypal" href="https://www.paypal.com" target="_blank">Paypal</a>
              <button type="submit" class="btn btn-primary btn-lg"><span class="fa fa-shopping-cart"></span> Pay subscription</button>
              <a href="/subscribe" class="btn btn-link">Cancel</a>
              <p class="agreement">
                <span>By clicking the &quot;Pay subscription&quot; button, you are confirming that this purchase is what you wanted and that you have read the <a href="/help/agreement">user agreement</a>.</span>
              </p>
            </div>

          </form>
        </div>
      </div>
    </section>
  </div>
  <?php include 'seg/foot.php' ?>
  <?php include 'seg/commonbottom.php' ?>
  <script src="<?=Config::cdnv()?>/web.js"></script>
  
  <script>
  $(function(){
    $('form.onceoff').on('submit', function(){
      var frm = $(this);
      frm.find('[type="submit"]').attr("disabled", "disabled");
      window.setTimeout(function(){
        frm.find('[type="submit"]').removeAttr("disabled");
      }, 30000);
    });
    $('textarea[name="sub-message"]').on('keyup', function(){
      $('#extraMessage small').css('display',($(this).val().length > 200) ? 'block':'none');
    });
  });
  </script>
  
</body>
</html>