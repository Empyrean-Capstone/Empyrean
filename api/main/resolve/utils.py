"""TODO."""
from astropy.time import Time
from astroquery.simbad import Simbad
from astropy.coordinates import EarthLocation, SkyCoord, AltAz
import astropy.units as u
from time import sleep

Simbad.ROW_LIMIT = 1


def get_airmass(sky_coord):
    """
    TODO.

    Args:
        sky_coord ():

    Returns:

    """
    cur_time = Time.now()
    location = EarthLocation.of_site("lowell")

    alt_az_coord = AltAz(obstime=cur_time, location=location)

    obj_altaz = sky_coord.transform_to(alt_az_coord)

    return obj_altaz.alt.value


def resolve_target(target):
    """
    TODO.

    Args:
        target ():

    Returns:

    """
    query = Simbad.query_object(target)

    print(query)
    print(type(query))

    sky_coord = SkyCoord(
        query[0]["RA"], query[0]["DEC"], unit=(u.hourangle, u.deg)
    )

    ra = sky_coord.ra.to_string(
        unit=u.hourangle, sep=":", pad=True, precision=2
    )

    dec = sky_coord.dec.to_string(
        unit=u.deg, sep=":", pad=True, precision=2, alwayssign=True
    )

    obj_alt = get_airmass(sky_coord)

    print(obj_alt)

    if obj_alt > 15:
        obj_vis_bool = "True"
    else:
        obj_vis_bool = "False"

    return ra, dec, f"{obj_alt:.2f}", f"{obj_vis_bool:s}"
