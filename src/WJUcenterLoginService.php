<?php

namespace Weigather\WJUcenterLoginService;

use Encore\Admin\Extension;

class WJUcenterLoginService extends Extension
{
    public $name = 'wj_ucenter_login_service';

    public $views = __DIR__.'/../resources/views';

    public $assets = __DIR__.'/../resources/assets';

    public $migrations = __DIR__.'/../database/migrations';

}
