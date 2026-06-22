# Approved Die Cast Photos

`inbox/` is a local intake folder and must not be published or committed. Put the original owner-supplied or rights-reviewed image there, then add a matching entry to `kb/owner-photo-manifest.json`.

Allowed rights bases:

- `owner_created` — the submitter created and owns the photo.
- `owner_permission` — the rights holder granted GrailPulse permission; include `permission_reference`.
- `fair_use_editorial` — limited editorial reference use; include both `source_url` and `editorial_rationale`.

Run:

```powershell
npm run photos:owner:validate
node scripts/apply-owner-photos.mjs --apply --site-root "C:\Users\bubs9\diecast-site"
```

The apply step hashes the file, copies the approved asset to `approved/` and the site’s `public/owner-photos/`, then writes `kb/owner-photo-map.json`. The owner map overrides provisional marketplace imagery during the KB build.

Do not place marketplace downloads in this workflow merely because they are easy to obtain. Approval is about rights and provenance, not image quality alone.
