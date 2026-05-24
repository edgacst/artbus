# Supabase Auth Redirect Checklist

Supabase Auth redirect URLs cannot be changed with project SQL. Configure them in the Supabase Dashboard.

## Dashboard Path

Authentication > URL Configuration

## Site URL

```text
https://edgacst.github.io/artbus/
```

## Redirect URLs

Add all of these:

```text
https://edgacst.github.io/artbus/
https://edgacst.github.io/artbus/index.html
https://edgacst.github.io/artbus/mypage.html
http://127.0.0.1:8080/
http://127.0.0.1:8080/index.html
http://127.0.0.1:8080/mypage.html
```

## Auth Providers

For Google login, enable Google in:

Authentication > Providers > Google

Then add the callback URL shown by Supabase to the Google Cloud OAuth client.
