<?php

namespace nicomartin\ProgressiveWordPress;

class RegisterServiceWorker
{
    public static $serviceWorkerQuery = 'pwp_service_worker';

    public function run()
    {
        add_action('query_vars', [$this, 'queryVars']);
        add_action('wp_head', [$this, 'registerServiceWorkerScript']);
        add_action('parse_request', [$this, 'returnServiceWorker']);
        add_action('pwp_serviceworker', [$this, 'test']);
    }

    public function registerServiceWorkerScript()
    {
        $homeUrl      = trailingslashit(get_site_url());
        $homeUrlParts = parse_url($homeUrl);
        $path         = '/';
        if (array_key_exists('path', $homeUrlParts)) {
            $path = $homeUrlParts['path'];
        }
        ?>
      <script type="text/javascript" id="pwp-serviceworker">
        if (navigator.serviceWorker) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register(
                <?php echo $this->getServiceWorkerURL(); ?>, {
                'scope': "<?php echo str_replace('/', '\/', $path); ?>",
              },
            );
          });
        }
      </script>
        <?php
    }

    public function queryVars($query_vars)
    {
        $query_vars[] = self::$serviceWorkerQuery;

        return $query_vars;
    }

    public function returnServiceWorker($wp)
    {
        if (
            array_key_exists(
                self::$serviceWorkerQuery,
                $wp->query_vars
            ) &&
            1 == $wp->query_vars[self::$serviceWorkerQuery]
        ) {
            header('Content-Type: text/javascript; charset=utf-8');
            echo "/**\n";
            echo " * Service Worker initialized by Progressive WordPress\n";
            echo " * https://de.wordpress.org/plugins/progressive-wp/ \n";
            echo " */\n";
            do_action('pwp_serviceworker');
            exit;
        }
    }

    public function getServiceWorkerURL($encoded = true)
    {
        $url = add_query_arg([
            self::$serviceWorkerQuery => 1,
        ], home_url('/', 'https'));

        if ($encoded) {
            return wp_json_encode($url);
        }

        return $url;
    }

    public function test()
    {
        echo 'console.log("Hallo Welt 2")';
    }
}
