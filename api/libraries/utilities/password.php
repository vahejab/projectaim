<?php 
    class password{
        
        protected function random_str($length, $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
        {
            $str = '';
            $max = mb_strlen($keyspace, '8bit') - 1;
            for ($i = 0; $i < $length; ++$i) {
                $str .= $keyspace[random_int(0, $max)];
            }
            return $str;
        }

        protected function password($pwd)
        {
            $NewPassword = "";

            for( $i = 0; $i <= strlen($pwd)-1; $i++ ) {
                $charcode = ord(substr( $pwd, $i, 1 ));
                $NewChar = $charcode+2; $NewLetter = chr($NewChar);
                $NewPassword = $NewPassword . $NewLetter;
            }
            return $NewPassword;
        } 
    }