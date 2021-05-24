<?php

namespace nicomartin\ProgressiveWordPress;

use Minishlink\WebPush\WebPush as PHPWebPush;
use Minishlink\WebPush\Subscription;

class WebPushNotification
{
    private $title = '';
    private $body = '';
    private $url = '';
    private $image = null;
    private $receiver = [];

    public function __construct()
    {
    }

    public function send()
    {
        $data = [
            'title'    => addslashes($this->title), // Notification title
            'badge'    => self::getBadge(), // small Icon for the notificaion bar (96x96 px, png)
            'body'     => addslashes($this->body), // Notification message
            'icon'     => $this->image, // small image
            'image'    => '', // bigger image
            'redirect' => $this->url, // url
        ];

        $data    = apply_filters('pwp_push_data_values', $data);
        $vapid   = PushCredentialsWebPush::getVapid(false);
        $webPush = new PHPWebPush([
            'VAPID' => [
                'subject'    => $vapid['subject'],
                'publicKey'  => $vapid['publicKey'],
                'privateKey' => $vapid['privateKey'],
            ]
        ]);

        foreach ($this->receiver as $subscription) {
            $webPush->queueNotification(
                Subscription::create([
                    'endpoint' => $subscription->endpoint,
                    'keys'     => [
                        'p256dh' => $subscription->keys->p256dh,
                        'auth'   => $subscription->keys->auth
                    ],
                ]),
                json_encode($data)
            );
        }

        $success = [];
        $failed  = [];

        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();

            if ($report->isSuccess()) {
                $success[] = [
                    'id' => $endpoint,
                ];
            } else {
                $failed[] = [
                    'id'     => $endpoint,
                    'reason' => $report->getReason(),
                ];
            }
        }

        return [
            'type'    => 'success',
            'message' => '',
            'success' => $success,
            'failed'  => $failed,
        ];
    }

    /**
     * sets the Content of the Push notification
     *
     * @param string $title
     * @param string $body
     * @param string $url
     * @param int $imageId a Post ID of an Image (Attachment)
     *
     * @return void
     */

    public function setData($title, $body, $url, $imageId)
    {
        $this->title = $title;
        $this->body  = $body;
        $this->url   = $url;

        if ('attachment' == get_post_type($imageId)) {
            $image = Helpers::imageResize($imageId, 500, 500, true);
            if ($image) {
                $this->image = $image[0];
            }
        }
    }

    /**
     * @param array $receiver
     *
     * @return void
     */

    public function setSubscriptionsByIDs($receiver = [])
    {
        $this->receiver = PushSubscriptions::getPushSubscriptionsByIds($receiver);
    }

    /**
     * @return string the URL of the badge image
     */

    private static function getBadge()
    {
        $badge = pwpGetInstance()->Settings->getSingleSettingValue('push-badge');
        if ('attachment' == get_post_type($badge)) {
            $badge_image = Helpers::imageResize($badge, 96, 96, true);
            if ($badge_image) {
                return $badge_image[0];
            }
        }

        return '';
    }
}
