<?php

namespace nicomartin\ProgressiveWordPress;

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
        // todo: send. it.
        $subscriptions = PushSubscriptions::getPushSubscriptionsByIds($this->receiver);

        return [
            'title'         => $this->title,
            'body'          => $this->body,
            'url'           => $this->url,
            'image'         => $this->image,
            'badge'         => self::getBadge(),
            'subscriptions' => $subscriptions,
        ];
    }

    /**
     * sets the Content of the Push notification
     *
     * @param string $title
     * @param string $body
     * @param string $url
     * @param int $imageId a Post ID of an Image (Attachment)
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
     * @return void
     */

    public function setReceiver($receiver = [])
    {
        $this->receiver = $receiver;
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

    private function getPushSubscriptions()
    {
        // returns all Push subscriptions or only the ones in the desired group or with the desired ID
    }
}
