-- Update default reference frame image to local frame asset
update public.reference_frames
set image_url = '/frames/tha-phae-gate-frame.png',
    opacity = 0.85,
    updated_at = now()
where id = 'tha-phae-gate-main-reference';

