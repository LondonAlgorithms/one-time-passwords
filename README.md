# One-time passwords

```
HOTP(K,C) = Truncate(HMAC-SHA-1(K,C))
```

There is a `hmacSHA1` function provided.