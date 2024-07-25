import * as KANA from './kana.js'

export const STARTS = [
	KANA.A,
	KANA.I,
	KANA.U,
	KANA.E,
	KANA.O,
	KANA.KA,
	KANA.KI,
	KANA.KU,
	KANA.KE,
	KANA.KO,
	KANA.SA,
	KANA.SI,
	KANA.SU,
	KANA.SE,
	KANA.SO,
	KANA.TA,
	KANA.TI,
	KANA.TU,
	KANA.TE,
	KANA.TO,
	KANA.NA,
	KANA.NI,
	KANA.NU,
	KANA.NE,
	KANA.NO,
	KANA.HA,
	KANA.HI,
	KANA.HU,
	KANA.HE,
	KANA.HO,
	KANA.MA,
	KANA.MI,
	KANA.MU,
	KANA.ME,
	KANA.MO,
	KANA.YA,
	KANA.YU,
	KANA.YO,
	KANA.RA,
	KANA.RI,
	KANA.RU,
	KANA.RE,
	KANA.RO,
	KANA.WA,
]

export const DAKU_MAP = new Map([
	[KANA.GA, KANA.KA],
	[KANA.GI, KANA.KI],
	[KANA.GU, KANA.KU],
	[KANA.GE, KANA.KE],
	[KANA.GO, KANA.KO],
	[KANA.ZA, KANA.SA],
	[KANA.ZI, KANA.SI],
	[KANA.ZU, KANA.SU],
	[KANA.ZE, KANA.SE],
	[KANA.ZO, KANA.SO],
	[KANA.DA, KANA.TA],
	[KANA.DI, KANA.TI],
	[KANA.DU, KANA.TU],
	[KANA.DE, KANA.TE],
	[KANA.DO, KANA.TO],
	[KANA.BA, KANA.HA],
	[KANA.BI, KANA.HI],
	[KANA.BU, KANA.HU],
	[KANA.BE, KANA.HE],
	[KANA.BO, KANA.HO],
	[KANA.PA, KANA.HA],
	[KANA.PI, KANA.HI],
	[KANA.PU, KANA.HU],
	[KANA.PE, KANA.HE],
	[KANA.PO, KANA.HO],
	[KANA.XYA, KANA.YA],
	[KANA.XYU, KANA.YU],
	[KANA.XYO, KANA.YO],
])