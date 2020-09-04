<?php

namespace Encore\WJUcenterLoginService;

use Encore\Admin\Facades\Admin;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class WJUcenterLoginServiceServiceProvider extends ServiceProvider
{
    /**
     * {@inheritdoc}
     */
    public function boot(WJUcenterLoginService $extension)
    {
        if (!WJUcenterLoginService::boot()) {
            return;
        }

        if ($this->app->runningInConsole()) {
            $assets = $extension->assets();
            $this->publishes(
                [
                    $assets => public_path('vendor/weigather/wj_ucenter_login_service'),
                    __DIR__ . '/../database/migrations' => database_path('migrations'),
                    __DIR__ . '/../config' => config_path(),
                ],
                'wj_ucenter_login_service'
            );
        }


        if (config('wj_ucenter_login_service.scan_enable')) {


            Admin::css([
                admin_asset("vendor/weigather/wj_ucenter_login_service/css/scan_login.css"),
                admin_asset("vendor/weigather/wj_ucenter_login_service/css/scan_login_admin.css")
            ]);
            Admin::html('<script>
            var csrfToken="' . csrf_token() . '";
            var qrCodeLoading="' . admin_asset("vendor/weigather/wj_ucenter_login_service/img/qr_code_loading.gif") . '";
            </script>');
            Admin::js([
                admin_asset("vendor/weigather/wj_ucenter_login_service/js/scan_bind.js")
            ]);

            if ($views = $extension->views()) {
                $this->loadViewsFrom($views, 'wj_ucenter_login_service');
            }
            $this->app->booted(function () {
                WJUcenterLoginService::routes(__DIR__ . '/../routes/web.php');


                // 开放接口出来
                Route::group(array_merge(
                    [
                        'prefix' => config('admin.route.prefix')
                    ],
                    WJUcenterLoginService::config('route', [])
                ), __DIR__ . '/../routes/api.php');

            });
        }


    }

}